import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

const AUTH_SECRET = process.env.AUTH_SECRET || 'astro-consult-fallback-secret-development-key';
const TOKEN_NAME = 'astro_token';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, AUTH_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export async function getSessionUser() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
}

export { TOKEN_NAME };
