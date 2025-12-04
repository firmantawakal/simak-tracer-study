import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const admin = await prisma.admin.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: hashedPassword,
        name: 'Administrator',
      }
    });

    console.log('Admin account created/updated successfully:', {
      id: admin.id,
      username: admin.username,
      name: admin.name,
    });

    console.log('Login credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();