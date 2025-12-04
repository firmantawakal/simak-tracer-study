import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { alumniSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { major: { contains: search, mode: 'insensitive' as const } },
      ]
    } : {};

    const [alumni, total] = await Promise.all([
      prisma.alumni.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.alumni.count({ where })
    ]);

    return NextResponse.json({
      alumni,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alumni' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();

    const body = await request.json();
    const validatedData = alumniSchema.parse(body);

    // Check if email already exists
    const existingAlumni = await prisma.alumni.findUnique({
      where: { email: validatedData.email }
    });

    if (existingAlumni) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const alumni = await prisma.alumni.create({
      data: validatedData
    });

    return NextResponse.json(alumni, { status: 201 });
  } catch (error) {
    console.error('Error creating alumni:', error);
    return NextResponse.json(
      { error: 'Failed to create alumni' },
      { status: 500 }
    );
  }
}