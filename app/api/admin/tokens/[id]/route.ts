import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;

    await prisma.surveyToken.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Token deleted successfully' });
  } catch (error) {
    console.error('Error deleting token:', error);
    return NextResponse.json(
      { error: 'Failed to delete token' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;

    const token = await prisma.surveyToken.findUnique({
      where: { id },
      include: {
        alumni: true
      }
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 404 }
      );
    }

    if (token.isUsed) {
      return NextResponse.json(
        { error: 'Token has already been used' },
        { status: 400 }
      );
    }

    // TODO: Implement email service to resend token
    // For now, just return success

    return NextResponse.json({ message: 'Token resent successfully' });
  } catch (error) {
    console.error('Error resending token:', error);
    return NextResponse.json(
      { error: 'Failed to resend token' },
      { status: 500 }
    );
  }
}