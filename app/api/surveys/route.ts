import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Only return active surveys for public access
    const where = {
      isActive: true,
      // Only include surveys that haven't passed their deadline
      OR: [
        { deadline: null },
        { deadline: { gte: new Date() } }
      ],
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ]
      })
    };

    const surveys = await prisma.survey.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        createdAt: true,
        questions: true
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.survey.count({ where });

    // Get question count for each survey
    const surveysWithCounts = surveys.map((survey) => {
      let questionCount = 0;
      if (survey.questions && Array.isArray(survey.questions)) {
        questionCount = survey.questions.length;
      }

      return {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        deadline: survey.deadline,
        createdAt: survey.createdAt,
        questionCount
      };
    });

    return NextResponse.json({
      surveys: surveysWithCounts,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching public surveys:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data survei' },
      { status: 500 }
    );
  }
}