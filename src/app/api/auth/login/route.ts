import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyPassword, createToken, TOKEN_NAME } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const DEFAULT_ACCOUNTS = [
  {
    email: 'admin@astroveda.com',
    name: 'AstroVeda Admin',
    phone: '+919876543210',
    role: 'ADMIN',
    password: process.env.ADMIN_PASSWORD || 'AdminPassword123!',
  },
  {
    email: 'admin@astroconsult.com',
    name: 'AstroVeda Admin',
    phone: '+919876543210',
    role: 'ADMIN',
    password: process.env.ADMIN_PASSWORD || 'AdminPassword123!',
  },
  {
    email: 'customer@example.com',
    name: 'Aarav Sharma',
    phone: '+919876543211',
    role: 'CUSTOMER',
    password: 'CustomerPassword123!',
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = loginSchema.parse(body);
    const normalizedEmail = validated.email.toLowerCase().trim();

    let user: any = null;
    let isValid = false;

    // 1. Try querying the database
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });
      if (user) {
        isValid = await verifyPassword(validated.password, user.passwordHash);
      }
    } catch (dbError) {
      console.warn('Database query failed during login (serverless fallback active):', dbError);
    }

    // 2. If user was not found in DB or password didn't match DB hash, check built-in accounts
    if (!user || !isValid) {
      const defaultAcc = DEFAULT_ACCOUNTS.find((acc) => acc.email === normalizedEmail);
      if (defaultAcc && defaultAcc.password === validated.password) {
        user = {
          id: defaultAcc.role === 'ADMIN' ? 'admin-astroveda-master' : 'customer-demo-user',
          name: defaultAcc.name,
          email: defaultAcc.email,
          phone: defaultAcc.phone,
          role: defaultAcc.role,
        };
        isValid = true;
      }
    }

    if (!user || !isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });

    response.cookies.set({
      name: TOKEN_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error('Unhandled login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during login' },
      { status: 500 }
    );
  }
}
