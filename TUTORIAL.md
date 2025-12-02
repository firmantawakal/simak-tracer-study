# Tutorial Aplikasi Tracer Study Universitas Dumai

## Overview

Aplikasi Tracer Study Universitas Dumai adalah sistem untuk melacak perkembangan karir alumni Universitas Dumai. Aplikasi ini memiliki dua interface utama:
- **Admin Panel**: Untuk administrator universitas mengelola survey dan melihat hasil
- **Public Survey**: Untuk alumni mengisi tracer study

## Setup Awal

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database
Pastikan MySQL server berjalan dan database `simak_tracer_study` sudah dibuat.

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database (membuat admin user dan data sample)
npm run prisma:seed
```

### 3. Environment Variables
Copy dan konfigurasi file `.env`:
```bash
# Database
DATABASE_URL="mysql://root:123456@localhost:3306/simak_tracer_study"

# Authentication
JWT_SECRET="your-super-secret-key-minimum-32-characters"
JWT_EXPIRY="7d"

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

### 4. Jalankan Aplikasi
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000` (atau port yang tersedia).

## Panduan Administrator

### Login Admin
1. Buka `http://localhost:3000/admin/login`
2. Masukkan credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

### Dashboard Admin
Setelah login, Anda akan diarahkan ke dashboard admin yang menampilkan:
- Total Alumni
- Total Survey
- Total Respon
- Tingkat Respon
- Survey Aktif
- Respon Terbaru

### Menu Navigasi Admin

#### 1. Dashboard (`/admin/dashboard`)
- Halaman utama dengan statistik ringkasan
- Grafik dan overview data tracer study

#### 2. Alumni (`/admin/alumni`)
- Kelola data alumni
- Tambah, edit, hapus alumni
- Import data alumni dari file CSV/Excel
- Generate token untuk alumni

#### 3. Surveys (`/admin/surveys`)
- Buat survey baru
- Edit survey yang ada
- Atur status survey (aktif/non-aktif)
- Tentukan deadline survey
- Desain questions dengan berbagai tipe:
  - Text input
  - Multiple choice
  - Rating scale
  - Checkbox
  - Dropdown

#### 4. Tokens (`/admin/tokens`)
- Generate token survey untuk alumni
- Monitoring status token (used/unused)
- Export token untuk distribusi
- Set expiry date untuk token

#### 5. Responses (`/admin/responses`)
- Lihat semua respon survey
- Filter berdasarkan survey atau periode
- Export data ke CSV/Excel
- Analisis hasil survey
- Download laporan

#### 6. Settings (`/admin/settings`)
- Konfigurasi aplikasi
- Email settings
- Backup data
- User management

## Alur Kerja Admin

### 1. Membuat Survey Baru
1. Masuk ke menu **Surveys**
2. Klik **Tambah Survey**
3. Isi informasi dasar:
   - Judul survey
   - Deskripsi
   - Deadline (opsional)
4. Design questions:
   - Tambahkan pertanyaan
   - Pilih tipe pertanyaan
   - Atur required/optional
5. Atur status menjadi **Aktif**
6. Save survey

### 2. Generate Token untuk Alumni
1. Masuk ke menu **Alumni**
2. Pastikan data alumni sudah lengkap
3. Masuk ke menu **Tokens**
4. Pilih survey yang akan digenerate
5. Pilih alumni yang akan dikirim token
6. Set expiry date (default 7 hari)
7. Generate tokens
8. Download atau kirim token via email

### 3. Monitoring Respon
1. Masuk ke menu **Responses**
2. Filter respon berdasarkan:
   - Survey tertentu
   - Periode waktu
   - Status respon
3. View detail respon individual
4. Export data untuk analisis lebih lanjut

## Panduan Alumni

### Mengisi Survey
1. Alumni menerima link survey dengan token unik
2. Format link: `http://localhost:3000/survey/[TOKEN]`
3. Halaman akan menampilkan:
   - Judul survey
   - Deskripsi
   - Form pertanyaan
4. Alumni mengisi semua required fields
5. Submit survey
6. Konfirmasi berhasil

### Validasi Token
- Token unik untuk setiap alumni-survey combination
- Token memiliki expiry date
- Token yang sudah used tidak bisa digunakan lagi
- Sistem akan otomatis redirect ke halaman error jika token invalid

## Fitur Lainnya

### Email Notifications
- Automated email saat survey dibuat
- Reminder untuk alumni yang belum mengisi
- Konfirmasi terima kasih setelah mengisi

### Data Export
- Export alumni data (CSV, Excel)
- Export survey responses (CSV, Excel)
- Export statistical reports

### Security
- JWT authentication untuk admin
- Token-based access untuk survey
- HTTP-only cookies
- Password hashing dengan bcrypt

## Troubleshooting

### Admin Login Failed
- Cek koneksi database
- Pastikan admin user sudah ada di database
- Run `npm run prisma:seed` untuk membuat admin user

### Survey Token Invalid
- Pastikan token belum expired
- Cek apakah token sudah digunakan
- Generate ulang token jika perlu

### Database Connection Error
- Pastikan MySQL server berjalan
- Cek DATABASE_URL di .env
- Pastikan database sudah dibuat

### Development Issues
- Clear cache: `rm -rf .next`
- Restart development server
- Check Prisma client generation

## Default Credentials

**Admin Login:**
- Username: `admin`
- Password: `admin123`

**Sample Alumni (untuk testing):**
- Ahmad Rizki (ahmad.rizki@alumni.universitasdumai.ac.id)
- Siti Nurhaliza (siti.nurhaliza@alumni.universitasdumai.ac.id)
- Budi Santoso (budi.santoso@alumni.universitasdumai.ac.id)

## Support

Untuk masalah teknis atau pertanyaan, hubungi:
- IT Support Universitas Dumai
- Email: support@universitasdumai.ac.id

---

*Update terakhir: Desember 2024*