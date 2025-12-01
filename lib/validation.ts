import { z } from 'zod';

export const createSurveySchema = z.object({
  title: z.string().min(1, 'Judul survey wajib diisi').max(200, 'Judul maksimal 200 karakter'),
  description: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['multiple_choice', 'checkbox', 'text', 'rating']),
    question: z.string().min(1, 'Pertanyaan wajib diisi'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
    min: z.number().optional(),
    max: z.number().optional(),
  })).min(1, 'Minimal harus ada 1 pertanyaan'),
  deadline: z.string().optional(),
});

export const importAlumniSchema = z.array(z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  graduationYear: z.number().int().min(1950, 'Tahun lulus tidak valid').max(2100, 'Tahun lulus tidak valid'),
  major: z.string().min(1, 'Jurusan wajib diisi'),
}));

export const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const surveyResponseSchema = z.object({
  token: z.string().length(64, 'Token tidak valid'),
  answers: z.array(z.object({
    questionId: z.string(),
    answer: z.union([z.string(), z.array(z.string()), z.number()]),
  })),
});

export const searchAlumniSchema = z.object({
  query: z.string().min(1, 'Kata kunci pencarian wajib diisi'),
  page: z.number().int().min(1, 'Halaman harus lebih dari 0').default(1),
  limit: z.number().int().min(1, 'Limit harus lebih dari 0').max(100).default(10),
});