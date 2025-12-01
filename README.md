# Tracer Study Universitas Dumai

Sistem informasi tracer study untuk melacak perkembangan karir alumni Universitas Dumai.

## Fitur

### 🎯 Untuk Admin
- **Dashboard**: Statistik lengkap survey dan alumni
- **Manajemen Alumni**: Import data alumni, kelola informasi alumni
- **Survey Management**: Buat, edit, dan atur survey tracer study
- **Token System**: Generate dan kirim undangan survey ke alumni
- **Analisis Hasil**: Export data dan visualisasi hasil survey
- **Keamanan**: Login admin dengan token JWT

### 👥 Untuk Alumni
- **Akses Tanpa Login**: Akses survey melalui token unik
- **Survey Interaktif**: Berbagai jenis pertanyaan (pilihan ganda, rating, text)
- **Validasi Real-time**: Validasi form saat pengisian
- **Responsive Design**: Bekerja di desktop dan mobile

## Teknologi

- **Framework**: Next.js 15 (App Router)
- **Database**: MySQL dengan Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT Token
- **Email**: Nodemailer dengan SMTP
- **Type Safety**: TypeScript
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Custom components dengan Tailwind

## Persyaratan Sistem

- Node.js 18.x atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- npm atau yarn

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd simak-tracer-study
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi Anda:
```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/simak_tracer_study"

# Authentication
JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_EXPIRY="7d"

# Token Configuration
TOKEN_EXPIRY_DAYS=7

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@universitasdumai.ac.id"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@universitasdumai.ac.id"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Tracer Study Universitas Dumai"
NODE_ENV="development"
```

### 4. Setup Database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed initial data
npm run prisma:seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:3000

## Default Login Admin

- **Username**: admin
- **Password**: admin123

> ⚠️ **Penting**: Ganti password default di production environment!

## Struktur Proyek

```
simak-tracer-study/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes (protected)
│   │   ├── dashboard/            # Dashboard admin
│   │   ├── alumni/               # Manajemen alumni
│   │   ├── surveys/              # Manajemen survey
│   │   └── login/                # Login admin
│   ├── (public)/                 # Public routes
│   │   └── survey/[token]/       # Survey form (public access)
│   ├── api/                      # API routes
│   └── actions/                  # Server Actions
├── components/                   # React components
│   ├── ui/                      # Reusable UI components
│   ├── forms/                   # Form components
│   └── layouts/                 # Layout components
├── lib/                         # Utility functions
├── types/                       # TypeScript definitions
├── prisma/                      # Database schema & migrations
└── public/                      # Static assets
```

## API Documentation

### Health Check
```
GET /api/health
```

### Server Actions
Semua operasi CRUD menggunakan Server Actions Next.js:

- `auth.actions.ts` - Authentication & authorization
- `alumni.actions.ts` - Alumni management
- `survey.actions.ts` - Survey CRUD operations
- `token.actions.ts` - Token generation & validation
- `response.actions.ts` - Survey response handling

## Security Features

### 🔐 Token-Based Survey Access
- **Secure Tokens**: 256-bit random tokens menggunakan `crypto.randomBytes(32)`
- **Hash Storage**: Token disimpan sebagai SHA-256 hash
- **One-Time Use**: Token tidak dapat digunakan kembali
- **Expiration**: Default 7 hari, dapat dikonfigurasi
- **Rate Limiting**: Perlindungan dari abuse

### 🛡️ Input Validation
- **Zod Schemas**: Validasi input server-side dan client-side
- **SQL Injection Protection**: Prisma ORM dengan parameterized queries
- **XSS Protection**: Sanitasi input dan escape output
- **CSRF Protection**: Built-in Next.js protection

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Build & Deployment

### Development Build
```bash
npm run build
npm start
```

### Production Environment Setup

1. **Environment Variables**
   - Set semua variabel production di `.env.production`
   - Gunakan JWT secret yang kuat (32+ karakter)
   - Konfigurasi database production
   - Set `NODE_ENV=production`

2. **Database Setup**
   - Jalankan migrations: `npx prisma migrate deploy`
   - Seed admin user: `npm run prisma:seed`
   - Setup connection pooling dan backups

3. **Security Configuration**
   - Gunakan HTTPS
   - Setup CORS jika diperlukan
   - Enable rate limiting
   - Review semua environment variables

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run format           # Format code with Prettier

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed      # Seed database with initial data

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
```

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Git Workflow

- **Branch Naming**: `feature/survey-builder`, `fix/token-validation`, `docs/readme-update`
- **Commit Convention**:
  - `feat: add survey creation feature`
  - `fix: resolve token expiration bug`
  - `docs: update API documentation`
  - `refactor: simplify validation logic`
- **Pull Requests**: Required untuk main branch, minimal 1 reviewer

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Code formatting
- **Testing**: Jest + React Testing Library
- **Type Safety**: No `any` types, explicit return types
- **Error Handling**: Structured error responses
- **Security**: Input validation, hashed secrets

## Performance Optimization

- **Database Queries**: Optimized dengan indexing dan select specific fields
- **Next.js Caching**: Automatic caching dengan revalidation
- **Image Optimization**: Next.js Image component dengan automatic optimization
- **Bundle Size**: Code splitting dan lazy loading
- **Database Connection**: Prisma connection pooling

## Monitoring & Maintenance

### Regular Tasks
- **Weekly**: Review error logs, monitor database performance
- **Monthly**: Update npm packages (`npm outdated`, `npm update`)
- **Quarterly**: Security audit (`npm audit`), review access logs
- **Yearly**: Archive old survey data, update documentation

### Monitoring Metrics
- Response rate per survey
- Token expiration rate
- API response times (should be < 200ms p95)
- Database query performance
- Email delivery success rate

## License

This project is proprietary to Universitas Dumai.

## Support

For technical support, please contact:
- IT Department Universitas Dumai
- Email: it-support@universitasdumai.ac.id

---

**© 2024 Universitas Dumai. All rights reserved.**