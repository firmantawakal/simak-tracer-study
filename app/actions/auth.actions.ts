'use server';

import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { LoginCredentials } from '@/types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export async function loginAdmin(credentials: LoginCredentials) {
  try {
    const { username, password } = credentials;

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        name: true,
      }
    });

    if (!admin) {
      return {
        success: false,
        error: 'Username atau password salah'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Username atau password salah'
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    // Set token in HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return {
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      }
    };

  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat login'
    };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = cookies();
    cookieStore.delete('admin-token');

    return {
      success: true,
      message: 'Logout berhasil'
    };

  } catch (error) {
    console.error('Logout error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan saat logout'
    };
  }
}