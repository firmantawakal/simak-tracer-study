import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple validation function
function validateResponse(data: any) {
  const errors: string[] = [];

  if (!data.answers || !Array.isArray(data.answers)) {
    errors.push('Answers must be an array');
  }

  if (!data.respondentInfo || typeof data.respondentInfo !== 'object') {
    errors.push('Respondent info is required');
  } else {
    if (!data.respondentInfo.name || typeof data.respondentInfo.name !== 'string') {
      errors.push('Name is required and must be a string');
    }
    if (!data.respondentInfo.email || typeof data.respondentInfo.email !== 'string') {
      errors.push('Email is required and must be a string');
    }
    if (!data.respondentInfo.graduationYear || typeof data.respondentInfo.graduationYear !== 'number') {
      errors.push('Graduation year is required and must be a number');
    }
    if (!data.respondentInfo.major || typeof data.respondentInfo.major !== 'string') {
      errors.push('Major is required and must be a string');
    }
  }

  return { valid: errors.length === 0, errors };
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: surveyId } = await params;
    const body = await request.json();

    // Validate request body
    const validation = validateResponse(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Data tidak valid', details: validation.errors },
        { status: 400 }
      );
    }

    const validatedData = body;

    // Check if survey exists and is active
    const survey = await prisma.survey.findFirst({
      where: {
        id: surveyId,
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

    // Since we can't query JSON field directly in Prisma MySQL,
    // we need to fetch all responses for this survey and check manually
    const allSurveyResponses = await prisma.response.findMany({
      where: {
        surveyId,
      },
      select: {
        id: true,
        answers: true
      }
    });

    // Check if email already responded
    const hasAlreadyResponded = allSurveyResponses.some(response => {
      if (response.answers && typeof response.answers === 'object' && 'respondentInfo' in response.answers) {
        const respondentInfo = response.answers.respondentInfo as any;
        return respondentInfo.email === validatedData.respondentInfo.email;
      }
      return false;
    });

    if (hasAlreadyResponded) {
      return NextResponse.json(
        { error: 'Anda sudah mengisi survei ini sebelumnya' },
        { status: 400 }
      );
    }

    const response = await prisma.response.create({
      data: {
        surveyId,
        tokenHash: `public_${Date.now()}`,
        answers: {
          ...validatedData,
          submittedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      message: 'Survei berhasil dikirim!',
      responseId: response.id
    });

  } catch (error) {
    console.error('Error submitting survey response:', error);

    return NextResponse.json(
      { error: 'Gagal mengirim jawaban survei' },
      { status: 500 }
    );
  }
}