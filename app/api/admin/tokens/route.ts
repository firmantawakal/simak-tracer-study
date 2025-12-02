import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { searchSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await verifyAdmin();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const surveyId = searchParams.get('surveyId') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

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

    if (status === 'used') {
      where.isUsed = true;
    } else if (status === 'unused') {
      where.isUsed = false;
      where.expiresAt = { gte: new Date() };
    } else if (status === 'expired') {
      where.expiresAt = { lt: new Date() };
    }

    const [tokens, total] = await Promise.all([
      prisma.surveyToken.findMany({
        where,
        include: {
          survey: {
            select: { id: true, title: true }
          },
          alumni: {
            select: { id: true, name: true, email: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.surveyToken.count({ where })
    ]);

    return NextResponse.json({
      tokens,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();

    const body = await request.json();
    const { surveyId, expiryDays = 7 } = body;

    if (!surveyId) {
      return NextResponse.json(
        { error: 'Survey ID is required' },
        { status: 400 }
      );
    }

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

    // TODO: Send emails with tokens (implement email service)

    return NextResponse.json({
      message: `Successfully generated ${newTokens.length} tokens`,
      tokens: newTokens
    });
  } catch (error) {
    console.error('Error generating tokens:', error);
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}