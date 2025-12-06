'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/dal';
import { createSurveySchema } from '@/lib/validation';
import { z } from 'zod';

export async function getSurveys(page: number = 1, limit: number = 10) {
  try {
    await verifyAdmin();

    const skip = (page - 1) * limit;

    const [surveys, total] = await Promise.all([
      prisma.survey.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              responses: true,
              tokens: true,
            },
          },
        },
      }),
      prisma.survey.count(),
    ]);

    return {
      success: true,
      data: surveys,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Get surveys error:', error);
    return {
      success: false,
      error: 'Gagal mengambil data survey',
    };
  }
}

export async function createSurvey(formData: FormData) {
  try {
    await verifyAdmin();

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      questions: JSON.parse(formData.get('questions') as string),
      deadline: formData.get('deadline'),
    };

    const validated = createSurveySchema.parse(rawData);

    const survey = await prisma.survey.create({
      data: {
        ...validated,
        deadline: validated.deadline ? new Date(validated.deadline) : null,
      },
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      data: survey,
    };

  } catch (error) {
    console.error('Create survey error:', error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Data survey tidak valid',
        details: error.errors,
      };
    }
    return {
      success: false,
      error: 'Gagal membuat survey',
    };
  }
}

export async function updateSurvey(surveyId: string, formData: FormData) {
  try {
    await verifyAdmin();

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      questions: JSON.parse(formData.get('questions') as string),
      deadline: formData.get('deadline'),
      isActive: formData.get('isActive') === 'true',
    };

    const validated = createSurveySchema.omit({}).extend({
      isActive: z.boolean(),
    }).parse(rawData);

    const survey = await prisma.survey.update({
      where: { id: surveyId },
      data: {
        ...validated,
        deadline: validated.deadline ? new Date(validated.deadline) : null,
      },
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      data: survey,
    };

  } catch (error) {
    console.error('Update survey error:', error);
    return {
      success: false,
      error: 'Gagal mengupdate survey',
    };
  }
}

export async function deleteSurvey(surveyId: string) {
  try {
    await verifyAdmin();

    await prisma.survey.delete({
      where: { id: surveyId },
    });

    revalidatePath('/admin/surveys');

    return {
      success: true,
      message: 'Survey berhasil dihapus',
    };

  } catch (error) {
    console.error('Delete survey error:', error);
    return {
      success: false,
      error: 'Gagal menghapus survey',
    };
  }
}

export async function getSurveyById(surveyId: string) {
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

    return {
      success: true,
      data: survey,
    };

  } catch (error) {
    console.error('Get survey error:', error);
    return {
      success: false,
      error: 'Gagal mengambil data survey',
    };
  }
}