import { z } from 'zod';

// Alumni validation schemas
export const alumniSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  email: z.string().email('Invalid email format'),
  graduationYear: z.number().int().min(1950, 'Invalid graduation year').max(new Date().getFullYear() + 5, 'Invalid graduation year'),
  major: z.string().min(1, 'Major is required').max(200, 'Major must be less than 200 characters'),
});

export const alumniUpdateSchema = alumniSchema.partial();

// Survey validation schemas
export const surveySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  questions: z.array(z.object({
    id: z.string(),
    type: z.enum(['text', 'textarea', 'multiple_choice', 'rating']),
    question: z.string().min(1, 'Question is required'),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })).min(1, 'At least one question is required'),
  isActive: z.boolean().default(true),
  deadline: z.string().datetime().optional().nullable(),
});

export const surveyUpdateSchema = surveySchema.partial();

export const createSurveySchema = surveySchema;

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const adminProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name must be less than 200 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100, 'Password must be less than 100 characters'),
  confirmPassword: z.string().min(8, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Survey response schema
export const surveyResponseSchema = z.object({
  token: z.string().length(64, 'Invalid token'),
  answers: z.array(z.object({
    question: z.string(),
    answer: z.union([z.string(), z.array(z.string()), z.number()]),
  })),
});

// Token management schemas
export const tokenGenerationSchema = z.object({
  surveyId: z.string().uuid('Invalid survey ID'),
  expiryDays: z.number().int().min(1, 'Expiry days must be at least 1').max(365, 'Expiry days must be less than 365'),
});

export const tokenBatchActionSchema = z.object({
  action: z.enum(['extend', 'resend', 'delete-expired']),
  surveyId: z.string().uuid('Invalid survey ID'),
  extendDays: z.number().int().min(1).max(365).optional(),
});

// Settings schemas
export const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required'),
  smtpPort: z.string().min(1, 'SMTP port is required'),
  smtpUser: z.string().email('Invalid SMTP email'),
  smtpPassword: z.string().min(1, 'SMTP password is required'),
  emailFrom: z.string().email('Invalid from email'),
});

export const tokenSettingsSchema = z.object({
  tokenExpiryDays: z.number().int().min(1, 'Token expiry must be at least 1 day').max(365, 'Token expiry must be less than 365 days'),
  jwtSecret: z.string().min(32, 'JWT secret must be at least 32 characters'),
  jwtExpiry: z.string().min(1, 'JWT expiry is required'),
});

// Search and pagination schemas
export const searchSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1, 'Page must be greater than 0').default(1),
  limit: z.number().int().min(1, 'Limit must be greater than 0').max(100, 'Limit must be less than 100').default(10),
});

export const searchAlumniSchema = searchSchema.extend({
  query: z.string().min(1, 'Search query is required'),
});

// Legacy schemas for backward compatibility
export const importAlumniSchema = z.array(alumniSchema);