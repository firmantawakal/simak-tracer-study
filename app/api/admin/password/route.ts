import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { passwordChangeSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    const body = await request.json();
    const validatedData = passwordChangeSchema.parse(body);

    // Get current admin with password
    const currentAdmin = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        password: true
      }
    });

    if (!currentAdmin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      currentAdmin.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}