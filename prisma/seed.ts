import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      name: 'Administrator Universitas Dumai',
    },
  });

  console.log('✅ Admin user created:', admin);

  // Create sample alumni data
  const sampleAlumni = [
    {
      name: 'Ahmad Rizki',
      email: 'ahmad.rizki@alumni.universitasdumai.ac.id',
      graduationYear: 2020,
      major: 'Teknik Informatika',
    },
    {
      name: 'Siti Nurhaliza',
      email: 'siti.nurhaliza@alumni.universitasdumai.ac.id',
      graduationYear: 2019,
      major: 'Manajemen',
    },
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@alumni.universitasdumai.ac.id',
      graduationYear: 2021,
      major: 'Akuntansi',
    },
  ];

  for (const alumni of sampleAlumni) {
    await prisma.alumni.upsert({
      where: { email: alumni.email },
      update: {},
      create: alumni,
    });
  }

  console.log('✅ Sample alumni data created');

  // Create sample survey
  const sampleSurvey = await prisma.survey.create({
    data: {
      title: 'Tracer Study Alumni Universitas Dumai 2024',
      description: 'Survey untuk melacak perkembangan karir alumni Universitas Dumai',
      questions: [
        {
          id: '1',
          type: 'text',
          question: 'Nama lengkap Anda',
          required: true,
        },
        {
          id: '2',
          type: 'multiple_choice',
          question: 'Status pekerjaan Anda saat ini?',
          required: true,
          options: ['Bekerja', 'Berwirausaha', 'Melanjutkan Studi', 'Belum Bekerja'],
        },
        {
          id: '3',
          type: 'text',
          question: 'Nama perusahaan/tempat kerja',
          required: false,
        },
        {
          id: '4',
          type: 'text',
          question: 'Posisi/Jabatan',
          required: false,
        },
        {
          id: '5',
          type: 'rating',
          question: 'Seberapa relevan pendidikan Anda dengan pekerjaan saat ini? (1-5)',
          required: true,
        },
        {
          id: '6',
          question: 'Saran dan masukan untuk pengembangan program studi',
          type: 'text',
          required: false,
        },
      ],
      isActive: true,
    },
  });

  console.log('✅ Sample survey created:', sampleSurvey);

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });