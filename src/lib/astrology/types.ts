export interface BirthProfileInput {
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm
  birthCity: string;
  birthCountry?: string;
  latitude?: number | null;
  longitude?: number | null;
  timezone?: string | null;
}

export interface PlanetInfo {
  name: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu' | string;
  sanskritName: string;
  sign: string;
  signNumber: number; // 1 to 12
  degree: number;
  house: number; // 1 to 12
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  isRetrograde: boolean;
}

export interface HouseInfo {
  houseNumber: number; // 1 to 12
  sign: string;
  signNumber: number; // 1 to 12
  signLord: string;
  planets: string[]; // planet names in this house
}

export interface DashaInfo {
  currentMahadasha: string;
  currentAntardasha: string;
  startDate: string;
  endDate: string;
  sequence: Array<{ planet: string; durationYears: number }>;
}

export interface ChartData {
  ascendant: {
    sign: string;
    signNumber: number;
    degree: number;
    nakshatra: string;
  };
  moonSign: string;
  sunSign: string;
  nakshatra: string;
  nakshatraPada: number;
  nakshatraLord: string;
  planets: PlanetInfo[];
  houses: HouseInfo[];
  dasha: DashaInfo;
  isMockData: boolean;
  generatedAt: string;
  calculationNote?: string;
}
