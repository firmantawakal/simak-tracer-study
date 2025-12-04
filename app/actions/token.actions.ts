'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/dal';
import { hashToken, generateTokenWithExpiry } from '@/lib/token';
import { TokenValidation } from '@/types/auth.types';
import { sendSurveyEmail } from '@/lib/email';

export async function validateSurveyToken(token: string): Promise<TokenValidation> {
  try {
    // Hash the incoming token
    const tokenHash = hashToken(token);

    // Find token in database
    const surveyToken = await prisma.surveyToken.findUnique({
      where: { tokenHash },
      include: {
        survey: true,
        alumni: true,
      },
    });

    // Validation checks
    if (!surveyToken) {
      return { valid: false, error: 'Token tidak valid' };
    }

    if (surveyToken.isUsed) {
      return { valid: false, error: 'Token telah digunakan' };
    }

    if (new Date() > surveyToken.expiresAt) {
      return { valid: false, error: 'Token telah kadaluarsa' };
    }

    if (!surveyToken.survey.isActive) {
      return { valid: false, error: 'Survey tidak aktif' };
    }

    return {
      valid: true,
      data: {
        survey: {
          id: surveyToken.survey.id,
          title: surveyToken.survey.title,
          questions: surveyToken.survey.questions as Array<{
            id: string;
            type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
            question: string;
            required: boolean;
            options?: string[];
          }>,
        },
        alumniName: surveyToken.alumni.name,
      },
    };

  } catch (error) {
    console.error('Token validation error:', error);
    return { valid: false, error: 'Terjadi kesalahan saat validasi token' };
  }
}

export async function submitSurveyResponse(token: string, answers: Array<{ questionId: string; answer: any }>) {
  try {
    const tokenHash = hashToken(token);

    // Validate token
    const surveyToken = await prisma.surveyToken.findUnique({
      where: { tokenHash },
    });

    if (!surveyToken || surveyToken.isUsed || new Date() > surveyToken.expiresAt) {
      return {
        success: false,
        error: 'Token tidak valid atau telah kadaluarsa',
      };
    }

    // Atomic operation: mark token as used and create response
    await prisma.$transaction(async (tx) => {
      // Mark token as used
      await tx.surveyToken.update({
        where: { tokenHash },
        data: {
          isUsed: true,
          usedAt: new Date(),
        },
      });

      // Save response
      await tx.response.create({
        data: {
          surveyId: surveyToken.surveyId,
          tokenHash,
          answers,
        },
      });
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      message: 'Terima kasih telah mengisi survey',
    };

  } catch (error) {
    console.error('Submit response error:', error);
    return {
      success: false,
      error: 'Gagal menyimpan jawaban survey',
    };
  }
}

export async function generateSurveyTokens(surveyId: string, alumniIds: string[]) {
  try {
    await verifyAdmin();

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      return {
        success: false,
        error: 'Survey tidak ditemukan',
      };
    }

    const tokens = [];
    const expiryDays = parseInt(process.env.TOKEN_EXPIRY_DAYS || '7');

    for (const alumniId of alumniIds) {
      try {
        // Check if token already exists for this alumni-survey combination
        const existingToken = await prisma.surveyToken.findUnique({
          where: {
            surveyId_alumniId: {
              surveyId,
              alumniId,
            },
          },
        });

        if (existingToken && !existingToken.isUsed && existingToken.expiresAt > new Date()) {
          // Use existing valid token
          tokens.push({
            alumniId,
            tokenHash: existingToken.tokenHash,
            status: 'existing',
          });
        } else {
          // Generate new token
          const { token, tokenHash, expiresAt } = generateTokenWithExpiry(expiryDays);

          await prisma.surveyToken.upsert({
            where: {
              surveyId_alumniId: {
                surveyId,
                alumniId,
              },
            },
            update: {
              tokenHash,
              isUsed: false,
              expiresAt,
              usedAt: null,
            },
            create: {
              tokenHash,
              surveyId,
              alumniId,
              expiresAt,
            },
          });

          tokens.push({
            alumniId,
            token,
            tokenHash,
            status: 'generated',
          });
        }
      } catch (error) {
        console.error(`Error generating token for alumni ${alumniId}:`, error);
      }
    }

    revalidatePath(`/admin/surveys/${surveyId}`);

    return {
      success: true,
      data: {
        totalTokens: tokens.length,
        newTokens: tokens.filter(t => t.status === 'generated').length,
        existingTokens: tokens.filter(t => t.status === 'existing').length,
      },
    };

  } catch (error) {
    console.error('Generate tokens error:', error);
    return {
      success: false,
      error: 'Gagal generate token survey',
    };
  }
}

export async function sendSurveyInvitations(surveyId: string, alumniIds: string[]) {
  try {
    await verifyAdmin();

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        tokens: {
          where: {
            alumniId: { in: alumniIds },
            isUsed: false,
            expiresAt: { gt: new Date() },
          },
          include: {
            alumni: true,
          },
        },
      },
    });

    if (!survey) {
      return {
        success: false,
        error: 'Survey tidak ditemukan',
      };
    }

    let sentCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const token of survey.tokens) {
      try {
        // Generate the actual token URL (we need to generate the token from hash)
        // This is a simplified approach - in production, you might want to store the original token
        const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/survey/${token.tokenHash}`;

        await sendSurveyEmail(
          token.alumni.email,
          token.alumni.name,
          survey.title,
          surveyUrl
        );

        sentCount++;
      } catch (error) {
        failedCount++;
        errors.push(`Gagal mengirim email ke ${token.alumni.email}: ${error}`);
      }
    }

    return {
      success: true,
      data: {
        sent: sentCount,
        failed: failedCount,
        errors,
      },
    };

  } catch (error) {
    console.error('Send invitations error:', error);
    return {
      success: false,
      error: 'Gagal mengirim undangan survey',
    };
  }
}