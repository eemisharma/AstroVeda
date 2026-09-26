import { NextResponse } from 'next/server';
import { getDailyHoroscope } from '@/lib/astrology/daily-rashifal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    const data = getDailyHoroscope(today);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating daily rashifal:', error);
    return NextResponse.json(
      { error: 'Failed to generate daily rashifal' },
      { status: 500 }
    );
  }
}
