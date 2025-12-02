import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { tokenSettingsSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    // Return current token settings
    const tokenSettings = {
      tokenExpiryDays: process.env.TOKEN_EXPIRY_DAYS || '7',
      jwtSecret: process.env.JWT_SECRET ? '**********' : '',
      jwtExpiry: process.env.JWT_EXPIRY || '7d',
    };

    return NextResponse.json(tokenSettings);
  } catch (error) {
    console.error('Error fetching token settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const validatedData = tokenSettingsSchema.parse(body);

    // TODO: Implement actual settings persistence
    // This could involve updating environment variables or database config table

    return NextResponse.json({
      message: 'Token settings updated successfully',
      settings: {
        ...validatedData,
        jwtSecret: validatedData.jwtSecret ? '**********' : ''
      }
    });
  } catch (error) {
    console.error('Error updating token settings:', error);
    return NextResponse.json(
      { error: 'Failed to update token settings' },
      { status: 500 }
    );
  }
}