'use server';

import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/dal';
import { SurveyStatistics, QuestionStatistics } from '@/types/response.types';

export async function getSurveyResponses(surveyId: string, page: number = 1, limit: number = 10) {
  try {
    await verifyAdmin();

    const skip = (page - 1) * limit;

    const [responses, total] = await Promise.all([
      prisma.response.findMany({
        where: { surveyId },
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          survey: {
            select: {
              title: true,
              questions: true,
            },
          },
        },
      }),
      prisma.response.count({
        where: { surveyId },
      }),
    ]);

    return {
      success: true,
      data: responses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Get responses error:', error);
    return {
      success: false,
      error: 'Gagal mengambil data respon',
    };
  }
}

export async function getSurveyStatistics(surveyId: string): Promise<{ success: boolean; data?: SurveyStatistics; error?: string }> {
  try {
    await verifyAdmin();

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        _count: {
          select: {
            responses: true,
            tokens: true,
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

    const responses = await prisma.response.findMany({
      where: { surveyId },
      select: {
        answers: true,
        submittedAt: true,
      },
    });

    const questions = survey.questions as Array<{
      id: string;
      question: string;
      type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
      options?: string[];
    }>;

    const questionStats: QuestionStatistics[] = questions.map((question) => {
      const questionAnswers = responses
        .map(response => response.answers as Array<{ questionId: string; answer: any }>)
        .flat()
        .filter(answer => answer.questionId === question.id);

      const responseCount = questionAnswers.length;

      switch (question.type) {
        case 'multiple_choice':
          const choiceCounts: Record<string, number> = {};
          questionAnswers.forEach(answer => {
            const choice = answer.answer as string;
            choiceCounts[choice] = (choiceCounts[choice] || 0) + 1;
          });

          const choices = (question.options || []).map(option => ({
            option,
            count: choiceCounts[option] || 0,
            percentage: responseCount > 0 ? ((choiceCounts[option] || 0) / responseCount) * 100 : 0,
          }));

          return {
            questionId: question.id,
            question: question.question,
            type: question.type,
            responseCount,
            choices,
          };

        case 'rating':
          const ratings = questionAnswers.map(answer => answer.answer as number);
          const averageRating = ratings.length > 0
            ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
            : 0;

          return {
            questionId: question.id,
            question: question.question,
            type: question.type,
            responseCount,
            averageRating: Math.round(averageRating * 100) / 100,
          };

        case 'text':
          const textResponses = questionAnswers.map(answer => answer.answer as string);

          return {
            questionId: question.id,
            question: question.question,
            type: question.type,
            responseCount,
            textResponses: textResponses.slice(0, 10), // Limit to first 10 responses
          };

        default:
          return {
            questionId: question.id,
            question: question.question,
            type: question.type,
            responseCount,
          };
      }
    });

    const statistics: SurveyStatistics = {
      totalResponses: survey._count.responses,
      totalSent: survey._count.tokens,
      responseRate: survey._count.tokens > 0
        ? (survey._count.responses / survey._count.tokens) * 100
        : 0,
      questionStats,
    };

    return {
      success: true,
      data: statistics,
    };

  } catch (error) {
    console.error('Get statistics error:', error);
    return {
      success: false,
      error: 'Gagal mengambil statistik survey',
    };
  }
}

export async function exportSurveyResponses(surveyId: string) {
  try {
    await verifyAdmin();

    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      select: {
        title: true,
        questions: true,
      },
    });

    if (!survey) {
      return {
        success: false,
        error: 'Survey tidak ditemukan',
      };
    }

    const responses = await prisma.response.findMany({
      where: { surveyId },
      orderBy: { submittedAt: 'desc' },
      select: {
        answers: true,
        submittedAt: true,
      },
    });

    const questions = survey.questions as Array<{
      id: string;
      question: string;
      type: 'multiple_choice' | 'checkbox' | 'text' | 'rating';
    }>;

    // Create CSV headers
    const headers = [
      'Tanggal Submit',
      ...questions.map(q => q.question),
    ];

    // Create CSV rows
    const rows = responses.map(response => {
      const answers = response.answers as Array<{ questionId: string; answer: any }>;
      const answerMap = new Map(answers.map(a => [a.questionId, a.answer]));

      return [
        new Date(response.submittedAt).toLocaleDateString('id-ID'),
        ...questions.map(question => {
          const answer = answerMap.get(question.id);
          if (Array.isArray(answer)) {
            return answer.join('; ');
          }
          return answer || '';
        }),
      ];
    });

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return {
      success: true,
      data: {
        filename: `${survey.title.replace(/[^a-z0-9]/gi, '_')}_responses.csv`,
        content: csvContent,
      },
    };

  } catch (error) {
    console.error('Export responses error:', error);
    return {
      success: false,
      error: 'Gagal mengekspor data respon',
    };
  }
}