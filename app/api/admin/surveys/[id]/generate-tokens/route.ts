import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    await verifyAdmin();

    const { id: surveyId } = await params;
    const body = await request.json();
    const { expiryDays = 7 } = body;

    // Verify survey exists
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId }
    });

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    // Get all alumni
    const alumni = await prisma.alumni.findMany();

    // Deactivate existing tokens for this survey
    await prisma.surveyToken.updateMany({
      where: { surveyId },
      data: {
        expiresAt: new Date() // Expire immediately
      }
    });

    // Generate new tokens
    const crypto = require('crypto');
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const newTokens = await Promise.all(
      alumni.map(alumni =>
        prisma.surveyToken.create({
          data: {
            tokenHash: crypto.createHash('sha256').update(`${surveyId}-${alumni.id}-${Date.now()}`).digest('hex'),
            surveyId,
            alumniId: alumni.id,
            expiresAt: expiryDate,
          },
          include: {
            survey: {
              select: { id: true, title: true }
            },
            alumni: {
              select: { id: true, name: true, email: true }
            }
          }
        })
      )
    );

    // TODO: Implement email service to send tokens
    // For now, just return the created tokens

    return NextResponse.json({
      message: `Successfully generated ${newTokens.length} tokens for survey "${survey.title}"`,
      tokens: newTokens,
      surveyTitle: survey.title,
      expiryDate: expiryDate.toISOString()
    });
  } catch (error) {
    console.error('Error generating tokens:', error);
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}