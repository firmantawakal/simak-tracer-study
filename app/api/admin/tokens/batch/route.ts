import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/dal';
import { prisma } from '@/lib/prisma';
import { tokenBatchActionSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    await verifyAdmin();
    const body = await request.json();
    const validatedData = tokenBatchActionSchema.parse(body);
    const { action, surveyId, extendDays = 7 } = validatedData;

    let result: any = {};

    switch (action) {
      case 'extend':
        // Extend expiry of unused tokens
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + extendDays);

        const extendedTokens = await prisma.surveyToken.updateMany({
          where: {
            surveyId,
            isUsed: false,
            expiresAt: { gt: new Date() } // Not expired
          },
          data: {
            expiresAt: newExpiryDate
          }
        });

        result = {
          message: `Successfully extended ${extendedTokens.count} tokens by ${extendDays} days`,
          extendedCount: extendedTokens.count
        };
        break;

      case 'resend':
        // Resend unused tokens (would integrate with email service)
        const tokensToResend = await prisma.surveyToken.findMany({
          where: {
            surveyId,
            isUsed: false,
            expiresAt: { gt: new Date() }
          },
          include: {
            alumni: {
              select: {
                name: true,
                email: true
              }
            }
          }
        });

        // TODO: Implement email service to resend tokens
        // For now, just return the count
        result = {
          message: `Found ${tokensToResend.length} tokens to resend`,
          resendCount: tokensToResend.length
        };
        break;

      case 'delete-expired':
        // Delete expired tokens
        const deletedTokens = await prisma.surveyToken.deleteMany({
          where: {
            surveyId,
            expiresAt: { lt: new Date() }
          }
        });

        result = {
          message: `Successfully deleted ${deletedTokens.count} expired tokens`,
          deletedCount: deletedTokens.count
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid batch action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error performing batch action:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch action' },
      { status: 500 }
    );
  }
}