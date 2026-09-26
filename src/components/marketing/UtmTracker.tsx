'use client';

import { useEffect } from 'react';
import { captureUtmFromUrl, trackMetaPixelEvent } from '@/lib/marketing/utm';

export default function UtmTracker() {
  useEffect(() => {
    // Capture and persist UTM tags from Instagram Ads
    captureUtmFromUrl();

    // Fire Meta Pixel PageView if script is loaded
    trackMetaPixelEvent('PageView');
  }, []);

  return null;
}
