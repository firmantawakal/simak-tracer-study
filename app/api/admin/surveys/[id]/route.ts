import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { surveySchema } from '@/lib/validation';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tokens: true,
            responses: true
          }
        }
      }
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Survei tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data survei' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;
    const body = await request.json();

    const validatedData = surveySchema.parse(body);

    const survey = await prisma.survey.update({
      where: { id },
      data: validatedData
    });

    return NextResponse.json(survey);
  } catch (error) {
    console.error('Error updating survey:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui survei' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id } = await params;

    // Delete related tokens and responses first (cascade)
    await prisma.surveyToken.deleteMany({
      where: { surveyId: id }
    });

    await prisma.response.deleteMany({
      where: { surveyId: id }
    });

    await prisma.survey.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Survei berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting survey:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus survei' },
      { status: 500 }
    );
  }
}