export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  fbclid?: string;
}

const UTM_STORAGE_KEY = 'astro_utm_data';

export function captureUtmFromUrl(): UtmParams | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');
  const utmContent = urlParams.get('utm_content');
  const fbclid = urlParams.get('fbclid');

  if (utmSource || utmMedium || utmCampaign || utmContent || fbclid) {
    const params: UtmParams = {
      utm_source: utmSource || undefined,
      utm_medium: utmMedium || undefined,
      utm_campaign: utmCampaign || undefined,
      utm_content: utmContent || undefined,
      fbclid: fbclid || undefined,
    };

    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    } catch (e) {
      // Ignore storage errors in private browsing
    }

    return params;
  }

  return getStoredUtm();
}

export function getStoredUtm(): UtmParams | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

// Meta Pixel helper
export function trackMetaPixelEvent(eventName: string, data?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    try {
      (window as any).fbq('track', eventName, data);
    } catch (e) {
      console.warn('Meta Pixel event failed:', e);
    }
  }
}
