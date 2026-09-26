import { AstrologyProvider } from './provider.interface';
import { BirthProfileInput, ChartData, PlanetInfo, HouseInfo, DashaInfo } from './types';

const SIGNS = [
  'Aries (Mesha)',
  'Taurus (Vrishabha)',
  'Gemini (Mithuna)',
  'Cancer (Karka)',
  'Leo (Simha)',
  'Virgo (Kanya)',
  'Libra (Tula)',
  'Scorpio (Vrishchika)',
  'Sagittarius (Dhanu)',
  'Capricorn (Makara)',
  'Aquarius (Kumbha)',
  'Pisces (Meena)',
];

const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', lord: 'Mars' },
  { name: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', lord: 'Mercury' },
];

const DASHA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

export class MockAstrologyProvider implements AstrologyProvider {
  name = 'Vedic Astronomical Algorithmic Engine (Development Mock)';

  private getJulianDate(dob: string, tob: string): number {
    const [yearStr, monthStr, dayStr] = dob.split('-');
    const [hourStr, minStr] = (tob || '12:00').split(':');

    let year = parseInt(yearStr, 10);
    let month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10) + parseInt(minStr, 10) / 60.0;

    if (month <= 2) {
      year -= 1;
      month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const jd =
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      hour / 24.0 +
      B -
      1524.5;

    return jd;
  }

  private getNakshatraFromLongitude(deg: number) {
    const normDeg = ((deg % 360) + 360) % 360;
    const nakIndex = Math.floor(normDeg / (360 / 27));
    const remDeg = normDeg % (360 / 27);
    const pada = Math.floor(remDeg / (360 / (27 * 4))) + 1;
    const item = NAKSHATRAS[nakIndex % 27];
    return {
      name: item.name,
      lord: item.lord,
      pada,
      index: nakIndex,
      balanceFraction: 1 - remDeg / (360 / 27),
    };
  }

  async generateBirthChart(birthProfile: BirthProfileInput): Promise<ChartData> {
    return this.getChartData(birthProfile);
  }

  async getAscendant(birthProfile: BirthProfileInput): Promise<{ sign: string; signNumber: number; degree: number }> {
    const jd = this.getJulianDate(birthProfile.dateOfBirth, birthProfile.timeOfBirth);
    const t = (jd - 2451545.0) / 36525;
    // Mean sidereal time approximation in degrees
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * t * t;
    const lng = birthProfile.longitude || 77.209; // Default India lon
    const lst = ((gmst + lng) % 360 + 360) % 360;
    
    // Lahiri Ayanamsha (~24 deg for modern era)
    const ayanamsha = 23.85 + (t * 50.29) / 3600;
    const siderealAsc = ((lst - ayanamsha) % 360 + 360) % 360;
    const signNum = Math.floor(siderealAsc / 30) + 1;
    const degree = +(siderealAsc % 30).toFixed(2);

    return {
      sign: SIGNS[signNum - 1],
      signNumber: signNum,
      degree,
    };
  }

  async getPlanetaryPositions(birthProfile: BirthProfileInput): Promise<PlanetInfo[]> {
    const jd = this.getJulianDate(birthProfile.dateOfBirth, birthProfile.timeOfBirth);
    const d = jd - 2451545.0;
    const t = d / 36525;
    const ayanamsha = 23.85 + (t * 50.29) / 3600;

    const asc = await this.getAscendant(birthProfile);
    const ascSignNumber = asc.signNumber;

    // Approximated mean tropical longitudes
    const rawSun = (280.460 + 0.9856474 * d) % 360;
    const rawMoon = (218.316 + 13.176396 * d) % 360;
    const rawMars = (355.433 + 0.524033 * d) % 360;
    const rawMercury = (rawSun + 18 * Math.sin((d * 0.05))) % 360;
    const rawJupiter = (34.351 + 0.083085 * d) % 360;
    const rawVenus = (rawSun + 35 * Math.cos((d * 0.03))) % 360;
    const rawSaturn = (50.077 + 0.033444 * d) % 360;
    const rawRahu = (125.04 - 0.05295 * d) % 360;
    const rawKetu = (rawRahu + 180) % 360;

    const rawPlanets = [
      { name: 'Sun', sanskrit: 'Surya', long: rawSun, retro: false },
      { name: 'Moon', sanskrit: 'Chandra', long: rawMoon, retro: false },
      { name: 'Mars', sanskrit: 'Mangal', long: rawMars, retro: false },
      { name: 'Mercury', sanskrit: 'Budha', long: rawMercury, retro: false },
      { name: 'Jupiter', sanskrit: 'Guru', long: rawJupiter, retro: false },
      { name: 'Venus', sanskrit: 'Shukra', long: rawVenus, retro: false },
      { name: 'Saturn', sanskrit: 'Shani', long: rawSaturn, retro: false },
      { name: 'Rahu', sanskrit: 'Rahu', long: rawRahu, retro: true },
      { name: 'Ketu', sanskrit: 'Ketu', long: rawKetu, retro: true },
    ];

    return rawPlanets.map((p) => {
      const siderealDeg = ((p.long - ayanamsha) % 360 + 360) % 360;
      const signIndex = Math.floor(siderealDeg / 30);
      const signNumber = signIndex + 1;
      const degree = +(siderealDeg % 30).toFixed(2);
      // House in whole-sign system based on Ascendant
      let house = (signNumber - ascSignNumber + 12) % 12;
      if (house === 0) house = 12;

      const nak = this.getNakshatraFromLongitude(siderealDeg);

      return {
        name: p.name,
        sanskritName: p.sanskrit,
        sign: SIGNS[signIndex],
        signNumber,
        degree,
        house,
        nakshatra: nak.name,
        nakshatraLord: nak.lord,
        pada: nak.pada,
        isRetrograde: p.retro,
      };
    });
  }

  async getHouses(birthProfile: BirthProfileInput): Promise<HouseInfo[]> {
    const asc = await this.getAscendant(birthProfile);
    const planets = await this.getPlanetaryPositions(birthProfile);

    const houses: HouseInfo[] = [];

    for (let h = 1; h <= 12; h++) {
      let signNum = (asc.signNumber + h - 2) % 12 + 1;
      const sign = SIGNS[signNum - 1];
      const lord = SIGN_LORDS[signNum - 1];
      const housePlanets = planets
        .filter((p) => p.house === h)
        .map((p) => p.name);

      houses.push({
        houseNumber: h,
        sign,
        signNumber: signNum,
        signLord: lord,
        planets: housePlanets,
      });
    }

    return houses;
  }

  async getNakshatra(birthProfile: BirthProfileInput): Promise<{ name: string; pada: number; lord: string }> {
    const planets = await this.getPlanetaryPositions(birthProfile);
    const moon = planets.find((p) => p.name === 'Moon');
    if (moon) {
      return {
        name: moon.nakshatra,
        pada: moon.pada,
        lord: moon.nakshatraLord,
      };
    }
    return { name: 'Rohini', pada: 1, lord: 'Moon' };
  }

  async getDasha(birthProfile: BirthProfileInput): Promise<DashaInfo> {
    const planets = await this.getPlanetaryPositions(birthProfile);
    const moon = planets.find((p) => p.name === 'Moon');
    const moonLord = moon?.nakshatraLord || 'Moon';

    const order = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
    const startIndex = order.indexOf(moonLord);
    const sequence = [];

    for (let i = 0; i < 9; i++) {
      const p = order[(startIndex + i) % 9];
      sequence.push({
        planet: p,
        durationYears: DASHA_YEARS[p],
      });
    }

    const birthYear = parseInt(birthProfile.dateOfBirth.split('-')[0], 10) || 2000;
    const currentYear = new Date().getFullYear();
    const elapsedYears = Math.max(0, currentYear - birthYear);

    let cumulative = 0;
    let activeDasha = sequence[0].planet;
    let nextDasha = sequence[1]?.planet || 'Venus';

    for (const d of sequence) {
      cumulative += d.durationYears;
      if (elapsedYears <= cumulative) {
        activeDasha = d.planet;
        break;
      }
    }

    return {
      currentMahadasha: activeDasha,
      currentAntardasha: nextDasha,
      startDate: `${currentYear - 2}-01-01`,
      endDate: `${currentYear + 5}-12-31`,
      sequence,
    };
  }

  async getChartData(birthProfile: BirthProfileInput): Promise<ChartData> {
    const asc = await this.getAscendant(birthProfile);
    const planets = await this.getPlanetaryPositions(birthProfile);
    const houses = await this.getHouses(birthProfile);
    const dasha = await this.getDasha(birthProfile);
    const nak = await this.getNakshatra(birthProfile);

    const moon = planets.find((p) => p.name === 'Moon');
    const sun = planets.find((p) => p.name === 'Sun');

    return {
      ascendant: {
        sign: asc.sign,
        signNumber: asc.signNumber,
        degree: asc.degree,
        nakshatra: nak.name,
      },
      moonSign: moon?.sign || 'Taurus (Vrishabha)',
      sunSign: sun?.sign || 'Leo (Simha)',
      nakshatra: nak.name,
      nakshatraPada: nak.pada,
      nakshatraLord: nak.lord,
      planets,
      houses,
      dasha,
      isMockData: true,
      calculationNote: 'Calculated using Vedic astronomical mathematical model with Lahiri Ayanamsha (Development Demo Engine).',
      generatedAt: new Date().toISOString(),
    };
  }
}
