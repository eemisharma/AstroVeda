import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { vedicChatbotService, ChatUserAstrologyProfile } from '@/lib/ai/chatbot';
import { orderStore } from '@/lib/orders/order-store';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, message, language = 'hi', chatHistory = [], customBirthDetails } = body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 });
    }

    let profile: ChatUserAstrologyProfile = {
      fullName: 'प्रिय जातक',
      lagna: 'मेष (Aries)',
      moonSign: 'वृश्चिक (Scorpio)',
      sunSign: 'सिंह (Leo)',
      nakshatra: 'अनुराधा (Anuradha)',
      currentDasha: 'राहु - बृहस्पति (Rahu - Jupiter)',
      problemCategory: 'सामान्य परामर्श (General Guidance)',
    };

    // If orderId is provided, try to fetch real client & chart data from database
    if (orderId && typeof orderId === 'string' && orderId.trim() !== '') {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            birthProfile: true,
            analysis: true,
            service: true,
            user: true,
          },
        });

        if (order) {
          const bp = order.birthProfile;
          let parsedAstrology: any = {};
          if (order.analysis?.astrologyData) {
            try {
              parsedAstrology = JSON.parse(order.analysis.astrologyData);
            } catch {}
          }

          profile = {
            fullName: order.user?.name || profile.fullName,
            gender: bp?.gender || undefined,
            birthDate: bp?.dateOfBirth || profile.birthDate,
            birthTime: bp?.timeOfBirth || profile.birthTime,
            birthCity: bp?.birthCity || profile.birthCity,
            lagna: parsedAstrology.ascendant?.sign || profile.lagna,
            moonSign: parsedAstrology.moonSign || profile.moonSign,
            sunSign: parsedAstrology.sunSign || profile.sunSign,
            nakshatra: parsedAstrology.nakshatra || profile.nakshatra,
            currentDasha: parsedAstrology.dasha?.currentMahadasha
              ? `${parsedAstrology.dasha.currentMahadasha} - ${parsedAstrology.dasha.currentAntardasha || ''}`
              : profile.currentDasha,
            problemCategory: order.service?.name || profile.problemCategory,
            orderNumber: order.orderNumber,
          };
        } else {
          const stored = orderStore.getOrder(orderId);
          if (stored) {
            const bp = stored.birthProfile;
            const astro = stored.analysis?.astrologyData || {};
            profile = {
              fullName: stored.user?.name || bp?.fullName || profile.fullName,
              gender: bp?.gender || undefined,
              birthDate: bp?.dateOfBirth || profile.birthDate,
              birthTime: bp?.timeOfBirth || profile.birthTime,
              birthCity: bp?.birthCity || profile.birthCity,
              lagna: astro.ascendant?.sign || profile.lagna,
              moonSign: astro.moonSign || profile.moonSign,
              sunSign: astro.sunSign || profile.sunSign,
              nakshatra: astro.nakshatra || profile.nakshatra,
              currentDasha: astro.dasha?.currentMahadasha
                ? `${astro.dasha.currentMahadasha} - ${astro.dasha.currentAntardasha || ''}`
                : profile.currentDasha,
              problemCategory: stored.service?.name || profile.problemCategory,
              orderNumber: stored.orderNumber,
            };
          }
        }
      } catch (err) {
        console.warn('Failed to retrieve order for AI chat, continuing with fallback profile:', err);
      }
    } else if (customBirthDetails && typeof customBirthDetails === 'object') {
      // Direct demo / custom birth details
      profile = {
        fullName: customBirthDetails.fullName || profile.fullName,
        gender: customBirthDetails.gender || profile.gender,
        birthDate: customBirthDetails.birthDate || profile.birthDate,
        birthTime: customBirthDetails.birthTime || profile.birthTime,
        birthCity: customBirthDetails.birthCity || profile.birthCity,
        lagna: customBirthDetails.lagna || profile.lagna,
        moonSign: customBirthDetails.moonSign || profile.moonSign,
        sunSign: customBirthDetails.sunSign || profile.sunSign,
        nakshatra: customBirthDetails.nakshatra || profile.nakshatra,
        currentDasha: customBirthDetails.currentDasha || profile.currentDasha,
        problemCategory: customBirthDetails.problemCategory || profile.problemCategory,
      };
    }

    const reply = await vedicChatbotService.generateReply({
      message,
      language: language === 'en' ? 'en' : 'hi',
      chatHistory,
      profile,
    });

    return NextResponse.json({
      reply,
      profile: {
        fullName: profile.fullName,
        lagna: profile.lagna,
        moonSign: profile.moonSign,
        nakshatra: profile.nakshatra,
        currentDasha: profile.currentDasha,
        problemCategory: profile.problemCategory,
        orderNumber: profile.orderNumber,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat route:', error);
    return NextResponse.json(
      { error: 'Failed to process AI astrological consultation' },
      { status: 500 }
    );
  }
}
