'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ChatLiveRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = searchParams.toString();
    const target = params ? `/consultation/ai-chat?${params}` : '/consultation/ai-chat';
    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-400 border-t-transparent" />
    </div>
  );
}

export default function ChatLivePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center" />}>
      <ChatLiveRedirect />
    </Suspense>
  );
}
