import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
}

export async function verifyAdmin(): Promise<AdminUser> {
  const token = (await cookies()).get('admin-token')?.value;

  if (!token) {
    throw new Error('Unauthorized: No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;

    // Optional: Verify admin still exists in database
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        name: true,
      }
    });

    if (!admin) {
      throw new Error('Unauthorized: Admin not found');
    }

    return admin;
  } catch (error) {
    throw new Error('Unauthorized: Invalid token');
  }
}

export function verifyAdminToken(token: string): boolean {
  try {
    // Use the same fallback as the login API
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    jwt.verify(token, secret);
    return true;
  } catch (error) {
    console.log('Token verification error in DAL:', error.message);
    return false;
  }
}