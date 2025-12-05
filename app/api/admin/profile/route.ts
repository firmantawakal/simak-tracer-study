import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { adminProfileSchema } from '@/lib/validation';

export async function GET(_request: NextRequest) {
  try {
    const admin = await verifyAdmin();

    const profile = await prisma.admin.findUnique({
      where: { id: admin.id },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin();
    const body = await request.json();
    const validatedData = adminProfileSchema.parse(body);

    // Check if username is already taken by another admin
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        username: validatedData.username,
        id: { not: admin.id }
      }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: validatedData,
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedAdmin);
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return NextResponse.json(
      { error: 'Failed to update admin profile' },
      { status: 500 }
    );
  }
}