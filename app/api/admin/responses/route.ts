import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const surveyId = searchParams.get('surveyId') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { survey: { title: { contains: search, mode: 'insensitive' } } },
        { alumni: { name: { contains: search, mode: 'insensitive' } } },
        { alumni: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (surveyId) {
      where.surveyId = surveyId;
    }

    const [responses, total] = await Promise.all([
      prisma.response.findMany({
        where,
        include: {
          survey: {
            select: {
              id: true,
              title: true,
              questions: true
            }
          },
          alumni: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' }
      }),
      prisma.response.count({ where })
    ]);

    return NextResponse.json({
      responses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch responses' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await verifyAdmin();

    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get('surveyId');

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required for bulk delete' },
        { status: 400 }
      );
    }

    // Delete all responses for a specific survey
    const deletedCount = await prisma.response.deleteMany({
      where: { surveyId }
    });

    return NextResponse.json({
      message: `Successfully deleted ${deletedCount.count} responses`,
      deletedCount: deletedCount.count
    });
  } catch (error) {
    console.error('Error deleting responses:', error);
    return NextResponse.json(
      { error: 'Failed to delete responses' },
      { status: 500 }
    );
  }
}