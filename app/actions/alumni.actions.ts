'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyAdmin } from '@/lib/dal';
import { ImportAlumniData } from '@/types/alumni.types';

export async function getAlumniList(page: number = 1, limit: number = 10) {
  try {
    await verifyAdmin();

    const skip = (page - 1) * limit;

    const [alumni, total] = await Promise.all([
      prisma.alumni.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          graduationYear: true,
          major: true,
          createdAt: true,
          _count: {
            select: {
              tokens: true,
            },
          },
        },
      }),
      prisma.alumni.count(),
    ]);

    return {
      success: true,
      data: alumni,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Get alumni error:', error);
    return {
      success: false,
      error: 'Gagal mengambil data alumni',
    };
  }
}

export async function importAlumni(alumniData: ImportAlumniData[]) {
  try {
    await verifyAdmin();

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const alumni of alumniData) {
      try {
        await prisma.alumni.upsert({
          where: { email: alumni.email },
          update: {
            name: alumni.name,
            graduationYear: alumni.graduationYear,
            major: alumni.major,
          },
          create: alumni,
        });
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Gagal import ${alumni.email}: ${error}`);
      }
    }

    revalidatePath('/admin/alumni');

    return {
      success: true,
      data: results,
    };

  } catch (error) {
    console.error('Import alumni error:', error);
    return {
      success: false,
      error: 'Gagal import data alumni',
    };
  }
}

export async function deleteAlumni(alumniId: string) {
  try {
    await verifyAdmin();

    await prisma.alumni.delete({
      where: { id: alumniId },
    });

    revalidatePath('/admin/alumni');

    return {
      success: true,
      message: 'Alumni berhasil dihapus',
    };

  } catch (error) {
    console.error('Delete alumni error:', error);
    return {
      success: false,
      error: 'Gagal menghapus alumni',
    };
  }
}

export async function searchAlumni(query: string, page: number = 1, limit: number = 10) {
  try {
    await verifyAdmin();

    const skip = (page - 1) * limit;

    const [alumni, total] = await Promise.all([
      prisma.alumni.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { major: { contains: query } },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          graduationYear: true,
          major: true,
          createdAt: true,
          _count: {
            select: {
              tokens: true,
            },
          },
        },
      }),
      prisma.alumni.count({
        where: {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { major: { contains: query } },
          ],
        },
      }),
    ]);

    return {
      success: true,
      data: alumni,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

  } catch (error) {
    console.error('Search alumni error:', error);
    return {
      success: false,
      error: 'Gagal mencari alumni',
    };
  }
}