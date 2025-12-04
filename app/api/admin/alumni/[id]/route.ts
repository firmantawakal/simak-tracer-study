import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { alumniSchema } from '@/lib/validation';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;
    const alumni = await prisma.alumni.findUnique({
      where: { id }
    });

    if (!alumni) {
      return NextResponse.json(
        { error: 'Alumni tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data alumni' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;
    const body = await request.json();
    const validatedData = alumniSchema.parse(body);

    // Check if email already exists (excluding current alumni)
    const existingAlumni = await prisma.alumni.findFirst({
      where: {
        email: validatedData.email,
        id: { not: id }
      }
    });

    if (existingAlumni) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    const alumni = await prisma.alumni.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(alumni);
  } catch (error) {
    console.error('Error updating alumni:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui alumni' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;

    // Check if alumni has related tokens or responses
    const relatedData = await prisma.alumni.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tokens: true
          }
        }
      }
    });

    if (!relatedData) {
      return NextResponse.json(
        { error: 'Alumni tidak ditemukan' },
        { status: 404 }
      );
    }

    if (relatedData._count.tokens > 0) {
      return NextResponse.json(
        { error: 'Tidak dapat menghapus alumni yang memiliki token survei. Silakan hapus token terlebih dahulu.' },
        { status: 400 }
      );
    }

    await prisma.alumni.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Alumni berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting alumni:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus alumni' },
      { status: 500 }
    );
  }
}