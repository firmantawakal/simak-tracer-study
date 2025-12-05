import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const survey = await prisma.survey.findFirst({
      where: {
        id,
        isActive: true,
        OR: [
          { deadline: null },
          { deadline: { gte: new Date() } }
        ]
      }
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Survei tidak ditemukan atau tidak aktif' },
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