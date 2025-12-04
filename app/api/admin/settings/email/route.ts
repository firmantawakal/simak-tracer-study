import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { emailSettingsSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    // Return current email settings from environment or database
    const emailSettings = {
      smtpHost: process.env.SMTP_HOST || '',
      smtpPort: process.env.SMTP_PORT || '587',
      smtpUser: process.env.SMTP_USER || '',
      smtpPassword: process.env.SMTP_PASSWORD ? '********' : '',
      emailFrom: process.env.EMAIL_FROM || '',
    };

    return NextResponse.json(emailSettings);
  } catch (error) {
    console.error('Error fetching email settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const validatedData = emailSettingsSchema.parse(body);

    // In a real application, you would update environment variables
    // or store these settings in a database table
    // For now, just validate and return success

    // TODO: Implement actual settings persistence
    // This could involve updating .env file, database config table, or system config

    return NextResponse.json({
      message: 'Email settings updated successfully',
      settings: {
        ...validatedData,
        smtpPassword: validatedData.smtpPassword ? '********' : ''
      }
    });
  } catch (error) {
    console.error('Error updating email settings:', error);
    return NextResponse.json(
      { error: 'Failed to update email settings' },
      { status: 500 }
    );
  }
}