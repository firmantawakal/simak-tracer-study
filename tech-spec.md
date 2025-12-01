# Tracer Study Application - Technical Specification

## Project Overview
A secure, efficient tracer study application for collecting alumni survey data without requiring login. The system uses tokenized links for survey access while maintaining robust security measures. Built with Next.js for seamless full-stack development in a single codebase.

---

## Technology Stack

### Core Framework
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MySQL 8.0+
- **ORM**: Prisma 6.x
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js or custom JWT for admin
- **Validation**: Zod
- **Email Service**: Nodemailer with SMTP

### Development Tools
- **Package Manager**: npm or pnpm
- **Linter**: ESLint (Next.js config)
- **Formatter**: Prettier
- **Testing**: Jest + React Testing Library
- **Type Checking**: TypeScript compiler

---

## Project Structure

```

tracer-study/
├── app/
│   ├── (admin)/                    \# Admin routes (protected)
│   │   ├── layout.tsx              \# Admin layout with auth check
│   │   ├── dashboard/
│   │   │   └── page.tsx            \# Dashboard page
│   │   ├── alumni/
│   │   │   ├── page.tsx            \# Alumni list
│   │   │   └── import/
│   │   │       └── page.tsx        \# CSV import page
│   │   ├── surveys/
│   │   │   ├── page.tsx            \# Survey list
│   │   │   ├── create/
│   │   │   │   └── page.tsx        \# Create survey
│   │   │   └── [id]/
│   │   │       ├── page.tsx        \# Survey details
│   │   │       ├── edit/
│   │   │       │   └── page.tsx    \# Edit survey
│   │   │       └── responses/
│   │   │           └── page.tsx    \# View responses
│   │   └── login/
│   │       └── page.tsx            \# Admin login
│   │
│   ├── (public)/                   \# Public routes
│   │   └── survey/
│   │       └── [token]/
│   │           └── page.tsx        \# Survey form (public)
│   │
│   ├── api/                        \# API routes (if needed for REST)
│   │   └── health/
│   │       └── route.ts            \# Health check endpoint
│   │
│   ├── actions/                    \# Server Actions
│   │   ├── alumni.actions.ts       \# Alumni operations
│   │   ├── survey.actions.ts       \# Survey CRUD
│   │   ├── token.actions.ts        \# Token generation \& validation
│   │   ├── response.actions.ts     \# Survey submissions
│   │   └── auth.actions.ts         \# Authentication
│   │
│   ├── layout.tsx                  \# Root layout
│   └── page.tsx                    \# Landing page
│
├── components/
│   ├── ui/                         \# Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   └── Modal.tsx
│   ├── forms/                      \# Form components
│   │   ├── SurveyForm.tsx
│   │   ├── AlumniImportForm.tsx
│   │   └── QuestionBuilder.tsx
│   └── layouts/                    \# Layout components
│       ├── AdminNav.tsx
│       └── Header.tsx
│
├── lib/
│   ├── prisma.ts                   \# Prisma client singleton
│   ├── dal.ts                      \# Data Access Layer (security)
│   ├── auth.ts                     \# Auth utilities
│   ├── token.ts                    \# Token generation/validation
│   ├── email.ts                    \# Email service
│   ├── validation.ts               \# Zod schemas
│   └── utils.ts                    \# Helper functions
│
├── prisma/
│   ├── schema.prisma               \# Database schema
│   ├── migrations/                 \# Database migrations
│   └── seed.ts                     \# Seed data script
│
├── types/
│   ├── survey.types.ts
│   ├── alumni.types.ts
│   └── response.types.ts
│
├── public/
│   └── assets/                     \# Static assets
│
├── .env.example
├── .gitignore
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── README.md

```

---

## Core Features & Requirements

### 1. Alumni Management
- **Bulk Import**: CSV upload with validation (name, email, graduation year, major)
- **Unique Constraint**: Email must be unique
- **Admin Access**: Only authenticated admins can manage alumni data
- **Validation**: Email format, required fields, data sanitization

### 2. Survey Management
- **CRUD Operations**: Create, read, update, delete surveys (admin only)
- **Question Types**: 
  - Multiple choice (single select)
  - Checkboxes (multiple select)
  - Text input (short/long answer)
  - Rating scale (1-5, 1-10)
- **Survey Status**: Active/inactive toggle
- **Metadata**: Title, description, deadline, created/updated timestamps
- **Question Builder**: Drag-and-drop or form-based question creation

### 3. Token-Based Survey Access (No Login Required)

#### Security Requirements
- **Cryptographically Secure**: 256-bit random tokens using `crypto.randomBytes(32)`
- **One-Time Use**: Token invalidated immediately after survey submission
- **Time-Limited**: Default 7 days expiration (configurable)
- **Hashed Storage**: Store SHA-256 hash, never plaintext tokens
- **Unique Per Alumni**: One token per alumni per survey

#### Token Flow
```

1. Admin creates survey
2. Admin clicks "Send Survey" → selects alumni
3. System generates unique token for each alumni
4. Token stored as hash in database
5. Email sent with personalized link:
https://yourapp.com/survey/{token}
6. Alumni clicks link → system validates token
7. If valid \& not expired → show survey form
8. Alumni submits → token marked as used → response saved
9. Token cannot be reused
```

### 4. Survey Response Collection
- **Public Access**: No login required, accessed via token URL
- **Client-Side Validation**: Real-time form validation before submission
- **Server-Side Validation**: Zod schema validation in Server Action
- **Anonymous Storage**: No IP address or user agent tracking
- **Duplicate Prevention**: Token consumption prevents resubmission
- **Progress Indication**: Show survey completion progress

### 5. Admin Dashboard
- **Authentication**: JWT-based or NextAuth.js session
- **Survey Statistics**: Response rate, completion time, aggregated results
- **Data Visualization**: Charts for multiple choice/rating questions
- **Export Functionality**: Download responses as CSV/Excel
- **Alumni Management**: View, search, filter alumni
- **Token Monitoring**: View sent tokens, usage status, expiration

---

## Database Schema (Prisma)

```

// prisma/schema.prisma

generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "mysql"
url      = env("DATABASE_URL")
}

model Alumni {
id              String        @id @default(uuid())
name            String
email           String        @unique
graduationYear  Int
major           String
createdAt       DateTime      @default(now())
updatedAt       DateTime      @updatedAt
tokens          SurveyToken[]

@@index([email])
@@index([graduationYear])
}

model Survey {
id          String        @id @default(uuid())
title       String        @db.VarChar(200)
description String?       @db.Text
questions   Json          // Array of question objects
isActive    Boolean       @default(true)
deadline    DateTime?
createdAt   DateTime      @default(now())
updatedAt   DateTime      @updatedAt
tokens      SurveyToken[]
responses   Response[]

@@index([isActive])
@@index([createdAt])
}

model SurveyToken {
id          String    @id @default(uuid())
tokenHash   String    @unique @db.VarChar(64) // SHA-256 hash
surveyId    String
alumniId    String
isUsed      Boolean   @default(false)
expiresAt   DateTime
createdAt   DateTime  @default(now())
usedAt      DateTime?

survey      Survey    @relation(fields: [surveyId], references: [id], onDelete: Cascade)
alumni      Alumni    @relation(fields: [alumniId], references: [id], onDelete: Cascade)

@@unique([surveyId, alumniId]) // One token per alumni per survey
@@index([tokenHash])
@@index([expiresAt])
@@index([isUsed])
}

model Response {
id          String    @id @default(uuid())
surveyId    String
tokenHash   String    // Reference to token used (for audit)
answers     Json      // Array of answer objects
submittedAt DateTime  @default(now())

survey      Survey    @relation(fields: [surveyId], references: [id], onDelete: Cascade)

@@index([surveyId])
@@index([submittedAt])
}

model Admin {
id        String   @id @default(uuid())
username  String   @unique
password  String   // Bcrypt hashed (12 rounds)
name      String
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

@@index([username])
}

```

---

## Server Actions Architecture

### Authentication & Authorization Pattern

```

// lib/dal.ts - Data Access Layer
import { cookies } from 'next/headers'
import { verifyJWT } from './auth'

export async function verifyAdmin() {
const token = cookies().get('admin-token')?.value

if (!token) {
throw new Error('Unauthorized: No token provided')
}

const admin = await verifyJWT(token)

if (!admin) {
throw new Error('Unauthorized: Invalid token')
}

return admin
}

// Use in every admin Server Action
export async function getAlumniList() {
await verifyAdmin() // Throws if not authenticated

return prisma.alumni.findMany({
orderBy: { createdAt: 'desc' }
})
}

```

### Server Actions Structure

```

// app/actions/survey.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { verifyAdmin } from '@/lib/dal'
import { createSurveySchema } from '@/lib/validation'

export async function createSurvey(formData: FormData) {
// 1. Verify authentication
await verifyAdmin()

// 2. Parse and validate input
const rawData = {
title: formData.get('title'),
description: formData.get('description'),
questions: JSON.parse(formData.get('questions') as string),
deadline: formData.get('deadline')
}

const validated = createSurveySchema.parse(rawData)

// 3. Database operation
const survey = await prisma.survey.create({
data: {
...validated,
deadline: validated.deadline ? new Date(validated.deadline) : null
}
})

// 4. Revalidate cache
revalidatePath('/admin/surveys')

return { success: true, data: survey }
}

export async function deleteSurvey(surveyId: string) {
await verifyAdmin()

await prisma.survey.delete({
where: { id: surveyId }
})

revalidatePath('/admin/surveys')

return { success: true }
}

```

### Token Validation (Public Access)

```

// app/actions/token.actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { hashToken } from '@/lib/token'

export async function validateSurveyToken(token: string) {
// Hash the incoming token
const tokenHash = hashToken(token)

// Find token in database
const surveyToken = await prisma.surveyToken.findUnique({
where: { tokenHash },
include: {
survey: true,
alumni: true
}
})

// Validation checks
if (!surveyToken) {
return { valid: false, error: 'Invalid token' }
}

if (surveyToken.isUsed) {
return { valid: false, error: 'Token already used' }
}

if (new Date() > surveyToken.expiresAt) {
return { valid: false, error: 'Token expired' }
}

if (!surveyToken.survey.isActive) {
return { valid: false, error: 'Survey is no longer active' }
}

return {
valid: true,
data: {
survey: surveyToken.survey,
alumniName: surveyToken.alumni.name
}
}
}

export async function submitSurveyResponse(token: string, answers: any[]) {
const tokenHash = hashToken(token)

// Validate token
const surveyToken = await prisma.surveyToken.findUnique({
where: { tokenHash }
})

if (!surveyToken || surveyToken.isUsed || new Date() > surveyToken.expiresAt) {
throw new Error('Invalid or expired token')
}

// Atomic operation: mark token as used and create response
await prisma.\$transaction(async (tx) => {
// Mark token as used
await tx.surveyToken.update({
where: { tokenHash },
data: {
isUsed: true,
usedAt: new Date()
}
})

    // Save response
    await tx.response.create({
      data: {
        surveyId: surveyToken.surveyId,
        tokenHash,
        answers
      }
    })
    })

return { success: true }
}

```

---

## Security Implementation

### 1. Token Generation & Hashing

```

// lib/token.ts
import crypto from 'crypto'

export function generateSecureToken(): string {
return crypto.randomBytes(32).toString('hex') // 64 chars
}

export function hashToken(token: string): string {
return crypto
.createHash('sha256')
.update(token)
.digest('hex')
}

export function generateTokenWithExpiry(days: number = 7) {
const token = generateSecureToken()
const expiresAt = new Date()
expiresAt.setDate(expiresAt.getDate() + days)

return {
token,
tokenHash: hashToken(token),
expiresAt
}
}

```

### 2. Input Validation Schemas

```

// lib/validation.ts
import { z } from 'zod'

export const createSurveySchema = z.object({
title: z.string().min(1, 'Title required').max(200),
description: z.string().optional(),
questions: z.array(z.object({
id: z.string(),
type: z.enum(['multiple_choice', 'checkbox', 'text', 'rating']),
question: z.string().min(1),
required: z.boolean(),
options: z.array(z.string()).optional()
})).min(1, 'At least one question required'),
deadline: z.string().optional()
})

export const importAlumniSchema = z.array(z.object({
name: z.string().min(1),
email: z.string().email(),
graduationYear: z.number().int().min(1950).max(2100),
major: z.string().min(1)
}))

export const surveyResponseSchema = z.object({
token: z.string().length(64),
answers: z.array(z.object({
questionId: z.string(),
answer: z.union([z.string(), z.array(z.string()), z.number()])
}))
})

```

### 3. Rate Limiting

```

// middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function middleware(request: NextRequest) {
const ip = request.ip ?? 'anonymous'
const now = Date.now()
const windowMs = 60000 // 1 minute
const maxRequests = 20

const clientData = rateLimitMap.get(ip)

if (!clientData || now > clientData.resetTime) {
rateLimitMap.set(ip, {
count: 1,
resetTime: now + windowMs
})
} else {
clientData.count++

    if (clientData.count > maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      )
    }
    }

return NextResponse.next()
}

export const config = {
matcher: ['/survey/:path*', '/api/:path*']
}

```

### 4. Environment Variables Security

```


# .env.example

# Database

DATABASE_URL="mysql://user:password@localhost:3306/tracer_study"

# Authentication

JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_EXPIRY="7d"

# Token Configuration

TOKEN_EXPIRY_DAYS=7

# Email Configuration

SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourapp.com"

# Application

NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

```

---

## Code Quality Standards

### TypeScript Configuration

```

// tsconfig.json
{
"compilerOptions": {
"target": "ES2022",
"lib": ["dom", "dom.iterable", "esnext"],
"allowJs": true,
"skipLibCheck": true,
"strict": true,
"noEmit": true,
"esModuleInterop": true,
"module": "esnext",
"moduleResolution": "bundler",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "preserve",
"incremental": true,
"plugins": [{ "name": "next" }],
"paths": {
"@/*": ["./*"]
},
"strictNullChecks": true,
"noImplicitAny": true,
"noUnusedLocals": true,
"noUnusedParameters": true
}
}

```

### Naming Conventions

- **Files**: kebab-case → `survey-form.tsx`, `alumni.actions.ts`
- **Components**: PascalCase → `SurveyForm`, `AlumniTable`
- **Functions**: camelCase → `generateToken`, `validateEmail`
- **Constants**: UPPER_SNAKE_CASE → `TOKEN_EXPIRY_DAYS`, `MAX_QUESTIONS`
- **Types/Interfaces**: PascalCase → `Survey`, `AlumniData`, `TokenResponse`
- **Server Actions**: camelCase with descriptive verbs → `createSurvey`, `deleteSurvey`

### Component Structure

```

// components/forms/SurveyForm.tsx
'use client'

import { useState } from 'react'
import { submitSurveyResponse } from '@/app/actions/response.actions'
import { Button } from '@/components/ui/Button'
import type { Survey } from '@/types/survey.types'

interface SurveyFormProps {
survey: Survey
token: string
alumniName: string
}

export function SurveyForm({ survey, token, alumniName }: SurveyFormProps) {
const [answers, setAnswers] = useState<Record<string, any>>({})
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault()
setIsSubmitting(true)

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))
      
      await submitSurveyResponse(token, formattedAnswers)
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
    }

return (
<form onSubmit={handleSubmit} className="space-y-6">
```      <h1 className="text-2xl font-bold">{survey.title}</h1>      ```
```      <p className="text-gray-600">Welcome, {alumniName}!</p>      ```

      {/* Render questions */}
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Survey'}
      </Button>
    </form>
    )
}

```

---

## Testing Strategy

### Unit Tests

```

// __tests__/lib/token.test.ts
import { generateSecureToken, hashToken } from '@/lib/token'

describe('Token utilities', () => {
it('should generate 64-character token', () => {
const token = generateSecureToken()
expect(token).toHaveLength(64)
})

it('should generate unique tokens', () => {
const token1 = generateSecureToken()
const token2 = generateSecureToken()
expect(token1).not.toBe(token2)
})

it('should hash token consistently', () => {
const token = 'test-token-123'
const hash1 = hashToken(token)
const hash2 = hashToken(token)
expect(hash1).toBe(hash2)
})
})

```

### Integration Tests

```

// __tests__/actions/survey.actions.test.ts
import { createSurvey } from '@/app/actions/survey.actions'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/dal', () => ({
verifyAdmin: jest.fn().mockResolvedValue({ id: '1', username: 'admin' })
}))

describe('Survey Actions', () => {
afterAll(async () => {
await prisma.\$disconnect()
})

it('should create survey with valid data', async () => {
const formData = new FormData()
formData.append('title', 'Test Survey')
formData.append('questions', JSON.stringify([
{ id: '1', type: 'text', question: 'Test?', required: true }
]))

    const result = await createSurvey(formData)
    
    expect(result.success).toBe(true)
    expect(result.data.title).toBe('Test Survey')
    })
})

```

---

## Performance Optimization

### Database Query Optimization

```

// Use select to fetch only needed fields
const surveys = await prisma.survey.findMany({
select: {
id: true,
title: true,
isActive: true,
createdAt: true,
_count: {
select: { responses: true }
}
},
orderBy: { createdAt: 'desc' }
})

// Use pagination for large datasets
const alumni = await prisma.alumni.findMany({
skip: (page - 1) * limit,
take: limit,
orderBy: { createdAt: 'desc' }
})

```

### Next.js Caching Strategies

```

// app/admin/surveys/page.tsx
import { prisma } from '@/lib/prisma'

// Revalidate every 60 seconds
export const revalidate = 60

export default async function SurveysPage() {
const surveys = await prisma.survey.findMany()

return <SurveyList surveys={surveys} />
}

```

### Image Optimization

```

import Image from 'next/image'

// Next.js automatically optimizes images
<Image
src="/logo.png"
alt="Logo"
width={200}
height={100}
priority // For above-the-fold images
/>

```

---

## Deployment Checklist

### Production Environment Setup

1. **Environment Variables**
   - Set all production values in `.env.production`
   - Use strong JWT secret (32+ characters)
   - Configure production database URL
   - Set `NODE_ENV=production`

2. **Database**
   - Run migrations: `npx prisma migrate deploy`
   - Seed admin user: `npm run seed`
   - Enable connection pooling
   - Set up automated backups

3. **Security**
   - Enforce HTTPS only
   - Configure CORS if needed
   - Enable rate limiting
   - Set secure cookie flags
   - Review all environment variables

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure logging (Winston/Pino)
   - Monitor database performance
   - Track API response times

5. **Build & Deploy**
```

npm run build
npm start

```

### Docker Support (Optional)

```


# Dockerfile

FROM node:20-alpine AS base

# Dependencies

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Runner

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

```

---

## Development Workflow

### Setup Instructions

```


# 1. Clone repository

git clone <repository-url>
cd tracer-study

# 2. Install dependencies

npm install

# 3. Setup environment variables

cp .env.example .env

# Edit .env with your database credentials

# 4. Setup database

npx prisma migrate dev
npx prisma generate

# 5. Seed initial admin user

npm run seed

# 6. Start development server

npm run dev

```

### Available Scripts

```

{
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint",
"lint:fix": "next lint --fix",
"format": "prettier --write .",
"test": "jest",
"test:watch": "jest --watch",
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:studio": "prisma studio",
"seed": "ts-node prisma/seed.ts"
}
}

```

### Git Workflow

- **Branch Naming**: `feature/survey-builder`, `fix/token-validation`, `docs/readme-update`
- **Commit Convention**: 
  - `feat: add survey creation feature`
  - `fix: resolve token expiration bug`
  - `docs: update API documentation`
  - `refactor: simplify validation logic`
- **Pull Requests**: Required for main branch, minimum 1 reviewer
- **Pre-commit Hooks**: Run linter and type checking (using Husky)

---

## Code Agent Instructions

When generating code for this project, follow these rules strictly:

### 1. Server Actions
- Always add `'use server'` directive at the top of action files
- Verify authentication using `verifyAdmin()` for protected operations
- Validate all inputs with Zod schemas before processing
- Use try-catch blocks and return structured responses: `{ success: boolean, data?: any, error?: string }`
- Call `revalidatePath()` after mutations to update cached data

### 2. Database Operations
- Use Prisma Client for all database operations
- Never write raw SQL queries (use Prisma's type-safe API)
- Use transactions for operations that modify multiple tables
- Add appropriate indexes (defined in schema)
- Handle unique constraint violations gracefully

### 3. Component Development
- Use `'use client'` directive only when necessary (forms, interactivity)
- Prefer Server Components for data fetching
- Keep components small and focused (max 200 lines)
- Use TypeScript interfaces for props
- Implement loading and error states

### 4. Type Safety
- No `any` types (use `unknown` if type is truly unknown)
- Define explicit return types for functions
- Use Prisma-generated types from `@prisma/client`
- Create custom types in `/types` folder for complex objects

### 5. Error Handling
```

// Good pattern
try {
const result = await riskyOperation()
return { success: true, data: result }
} catch (error) {
console.error('Operation failed:', error)
return {
success: false,
error: error instanceof Error ? error.message : 'Unknown error'
}
}

```

### 6. Security Checklist
- [ ] Validate all user inputs with Zod
- [ ] Hash sensitive data (passwords, tokens)
- [ ] Verify authentication before data access
- [ ] Use parameterized queries (Prisma handles this)
- [ ] Sanitize error messages (no stack traces in production)
- [ ] Implement rate limiting on public endpoints
- [ ] Use HTTPS in production
- [ ] Store secrets in environment variables

### 7. Code Style
- Use functional components with hooks (no class components)
- Prefer `async/await` over `.then()` chains
- Keep functions pure when possible
- Use descriptive variable names (no single letters except loop counters)
- Add JSDoc comments for complex functions
- Format code with Prettier before committing

### 8. Example Pattern - Full Feature Implementation

```

// 1. Define types
// types/survey.types.ts
export interface Survey {
id: string
title: string
questions: Question[]
isActive: boolean
}

// 2. Create validation schema
// lib/validation.ts
export const createSurveySchema = z.object({
title: z.string().min(1).max(200),
questions: z.array(questionSchema).min(1)
})

// 3. Implement Server Action
// app/actions/survey.actions.ts
'use server'

import { verifyAdmin } from '@/lib/dal'
import { createSurveySchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createSurvey(formData: FormData) {
try {
await verifyAdmin()

    const data = {
      title: formData.get('title'),
      questions: JSON.parse(formData.get('questions') as string)
    }
    
    const validated = createSurveySchema.parse(data)
    
    const survey = await prisma.survey.create({ data: validated })
    
    revalidatePath('/admin/surveys')
    
    return { success: true, data: survey }
    } catch (error) {
return {
success: false,
error: error instanceof Error ? error.message : 'Failed to create survey'
}
}
}

// 4. Create UI Component
// components/forms/CreateSurveyForm.tsx
'use client'

import { createSurvey } from '@/app/actions/survey.actions'
import { Button } from '@/components/ui/Button'

export function CreateSurveyForm() {
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault()
setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const result = await createSurvey(formData)
    
    if (result.success) {
      // Show success message and redirect
    } else {
      // Show error message
    }
    
    setIsSubmitting(false)
    }

return (
<form onSubmit={handleSubmit}>
{/* Form fields */}
<Button type="submit" disabled={isSubmitting}>
Create Survey
</Button>
</form>
)
}

// 5. Create Page
// app/admin/surveys/create/page.tsx
import { CreateSurveyForm } from '@/components/forms/CreateSurveyForm'

export default function CreateSurveyPage() {
return (
<div>
<h1>Create New Survey</h1>
<CreateSurveyForm />
</div>
)
}

```

---

## Maintenance Guidelines

### Regular Tasks
- **Weekly**: Review error logs, check database performance
- **Monthly**: Update npm packages (`npm outdated`, `npm update`)
- **Quarterly**: Security audit (`npm audit`), review access logs
- **Yearly**: Review and archive old survey data, update documentation

### Monitoring Metrics
- Response rate per survey
- Token expiration rate (adjust expiry if too high)
- API response times (should be < 200ms p95)
- Database query performance
- Email delivery success rate

### Backup Strategy
- Daily automated database backups
- Weekly full system backups
- Retain backups for 30 days minimum
- Test restore procedure quarterly

---

## Summary

This specification provides a complete, production-ready architecture for a tracer study application using Next.js 15, TypeScript, Prisma, and MySQL. The system prioritizes:

- **Security**: Token-based authentication, input validation, hashed storage
- **Developer Experience**: Type-safe code, clear structure, comprehensive documentation
- **Performance**: Optimized queries, caching strategies, efficient architecture
- **Maintainability**: Clean code patterns, testing guidelines, monitoring setup
- **Scalability**: Structured for growth while remaining simple to understand

Follow this specification strictly to ensure consistent, high-quality code across the entire application.
```