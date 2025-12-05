import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Since we can't query JSON field directly in Prisma MySQL,
    // we need to fetch all responses and check manually
    const allResponses = await prisma.response.findMany({
      select: {
        id: true,
        surveyId: true,
        answers: true,
        submittedAt: true
      }
    });

    const userResponse = allResponses.find(response => {
      if (response.answers && typeof response.answers === 'object' && 'respondentInfo' in response.answers) {
        const respondentInfo = response.answers.respondentInfo as any;
        return respondentInfo.email === email;
      }
      return false;
    });

    if (userResponse) {
      return NextResponse.json({
        hasCompleted: true,
        completedSurveyId: userResponse.surveyId,
        completedAt: userResponse.submittedAt
      });
    }

    return NextResponse.json({
      hasCompleted: false
    });

  } catch (error) {
    console.error('Error checking survey completion:', error);
    return NextResponse.json(
      { error: 'Gagal memeriksa status survei' },
      { status: 500 }
    );
  }
}