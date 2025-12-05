import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

export async function POST(_request: NextRequest) {
  try {
    await verifyAdmin();

    // Get current timestamp for backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;

    // Generate SQL backup using MySQL commands
    const { exec } = require('child_process');
    const util = require('util');
    const execAsync = util.promisify(exec);

    // Get database connection details from environment
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Parse MySQL connection string
    const match = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) {
      throw new Error('Invalid DATABASE_URL format');
    }

    const [, user, password, host, port, database] = match;

    // Create backup using mysqldump
    const backupCommand = `mysqldump -u${user} -p${password} -h${host} -P${port} ${database}`;

    try {
      const { stdout } = await execAsync(backupCommand);

      // Create a temporary file to store the backup
      const fs = require('fs');
      const path = require('path');
      const tmpDir = require('os').tmpdir();
      const backupPath = path.join(tmpDir, filename);

      fs.writeFileSync(backupPath, stdout);

      // Return backup file for download
      const backupBuffer = fs.readFileSync(backupPath);

      // Clean up temporary file
      fs.unlinkSync(backupPath);

      return new NextResponse(backupBuffer, {
        headers: {
          'Content-Type': 'application/sql',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (execError) {
      console.error('Error executing mysqldump:', execError);
      throw new Error('Failed to create database backup using mysqldump');
    }
  } catch (error) {
    console.error('Error creating backup:', error);

    // Fallback: create a JSON backup
    try {
      const tables = ['Admin', 'Alumni', 'Survey', 'SurveyToken', 'Response'];
      const backupData: any = {};

      for (const table of tables) {
        // @ts-ignore
        const model = prisma[table.toLowerCase()];
        if (model) {
          backupData[table] = await model.findMany();
        }
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.json`;

      return new NextResponse(JSON.stringify(backupData, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (fallbackError) {
      console.error('Fallback JSON backup also failed:', fallbackError);
      return NextResponse.json(
        { error: 'Failed to create database backup' },
        { status: 500 }
      );
    }
  }
}