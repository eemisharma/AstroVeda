export interface OfficialService {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  deliveryTime: string;
  active: boolean;
}

export const FALLBACK_SERVICES: OfficialService[] = [
  {
    id: 'srv-1',
    slug: 'quick-kundli-glance',
    name: 'Quick Kundli Glance & Planetary Insights',
    description: 'Rapid Vedic calculation of your Ascendant (Lagna), Moon sign, 9 planetary positions, and active dasha snapshot.',
    price: 49,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
  },
  {
    id: 'srv-2',
    slug: 'life-direction-transit',
    name: 'Life Direction & Transit Guide',
    description: 'Focused planetary transit analysis covering your immediate life questions across career, emotional harmony, and major timings.',
    price: 89,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
  },
  {
    id: 'srv-3',
    slug: 'comprehensive-destiny',
    name: 'Comprehensive Destiny & House Analysis',
    description: 'In-depth 12-house reading, wealth yogas, career trajectory, relationship compatibility dynamics, and 2-year forecast.',
    price: 99,
    currency: 'INR',
    deliveryTime: '30 mins',
    active: true,
  },
  {
    id: 'srv-4',
    slug: 'vedic-kundli-whatsapp',
    name: 'Deep Vedic Kundli + Live WhatsApp Consultation',
    description: 'Complete 10-section Vedic horoscope analysis report with immediate direct WhatsApp chat consultation with an expert astrologer upon payment.',
    price: 149,
    currency: 'INR',
    deliveryTime: 'Instant on WhatsApp',
    active: true,
  },
  {
    id: 'srv-5',
    slug: 'premium-master-horoscope',
    name: 'AstroVeda Master Horoscope & Remedial Blueprint [Premium - Coming Soon]',
    description: 'All-inclusive master compendium covering every life domain, dosha shanti, gemstone & rudraksha recommendations, and custom Vedic remedial product bundle.',
    price: 499,
    currency: 'INR',
    deliveryTime: 'Coming Soon / Pre-book',
    active: true,
  },
];
