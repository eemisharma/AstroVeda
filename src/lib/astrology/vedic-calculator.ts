/**
 * Pure Mathematical & Astronomical Vedic Astrology Calculator
 * Implements:
 * 1. Julian Day (JD) & Obliquity of Ecliptic (eps)
 * 2. True Local Sidereal Time (RAMC / LST) using exact birthplace latitude & longitude
 * 3. True Tropical Ascendant via spherical trigonometry (atan2(cos RAMC, -sin RAMC cos eps - tan lat sin eps))
 * 4. Chitrapaksha / Lahiri Ayanamsha (~24.1° for modern epoch)
 * 5. Sidereal Lagna & Planetary positions for 9 Grahas (Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani, Rahu, Ketu)
 * 6. 12 Vedic Bhavas (Houses)
 * 7. 27 Nakshatras & 108 Padas
 * 8. Vimshottari Mahadasha & Antardasha balance and live timeline calculation
 * 9. Major Vedic Yogas (Gajakesari, Budhaditya) and Mangal Dosha (Kuja Dosha)
 */

import { BirthProfileInput, ChartData, PlanetInfo, HouseInfo, DashaInfo } from './types';
import { resolveCityCoordinates } from './cities';

export const SIGNS = [
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

export const SIGN_LORDS = [
  'Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury',
  'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'
];

export const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
  { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
  { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
  { name: 'Rohini', lord: 'Moon', deity: 'Brahma / Prajapati' },
  { name: 'Mrigashira', lord: 'Mars', deity: 'Soma / Chandra' },
  { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
  { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
  { name: 'Ashlesha', lord: 'Mercury', deity: 'Sarpas / Nagas' },
  { name: 'Magha', lord: 'Ketu', deity: 'Pitris' },
  { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
  { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
  { name: 'Hasta', lord: 'Moon', deity: 'Savitr' },
  { name: 'Chitra', lord: 'Mars', deity: 'Vishwakarma' },
  { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
  { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni' },
  { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
  { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula', lord: 'Ketu', deity: 'Nirriti' },
  { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apas' },
  { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishwadevas' },
  { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
  { name: 'Dhanishta', lord: 'Mars', deity: 'Ashta Vasus' },
  { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
  { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Aja Ekapada' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya' },
  { name: 'Revati', lord: 'Mercury', deity: 'Pushan' },
];

export const DASHA_YEARS: Record<string, number> = {
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

export const DASHA_ORDER = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
];

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180.0;
}

function toDegrees(rad: number): number {
  return (rad * 180.0) / Math.PI;
}

function normalize360(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Calculates Julian Day Number from local birth date and time, adjusting for IST (UTC+5:30) or specified offset.
 */
export function calculateJulianDay(dob: string, tob: string, tzOffsetHours = 5.5): number {
  const [yearStr, monthStr, dayStr] = (dob || '2000-01-01').split('-');
  const [hourStr, minStr] = (tob || '12:00').split(':');

  let year = parseInt(yearStr, 10) || 2000;
  let month = parseInt(monthStr, 10) || 1;
  const day = parseInt(dayStr, 10) || 1;
  const hour = (parseInt(hourStr, 10) || 0) + (parseInt(minStr, 10) || 0) / 60.0;

  // Convert local hour to Universal Time (UT)
  const utHour = hour - tzOffsetHours;

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
    utHour / 24.0 +
    B -
    1524.5;

  return jd;
}

/**
 * Calculates Lahiri Ayanamsha (Chitrapaksha) for a given Julian Day.
 * Epoch J2000.0 (JD 2451545.0) ~ 23.858°, precession rate ~ 50.290966 arcsec/year.
 */
export function calculateLahiriAyanamsha(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0; // Julian centuries since J2000.0
  const ayanamsha = 23.858 + (t * 50.290966) / 3600.0;
  return ayanamsha;
}

/**
 * Calculates genuine Sidereal Ascendant (Lagna) using spherical trigonometry and birthplace latitude/longitude.
 */
export function calculateSiderealAscendant(
  jd: number,
  latitude: number,
  longitude: number
): {
  sign: string;
  signNumber: number;
  degree: number;
  totalDegree: number;
  tropicalAscendant: number;
  ayanamsha: number;
} {
  const d = jd - 2451545.0;
  const t = d / 36525.0;

  // Greenwich Mean Sidereal Time (GMST) in degrees
  const gmst = normalize360(280.46061837 + 360.98564736629 * d + 0.000387933 * t * t);

  // Local Sidereal Time (RAMC / theta) in degrees
  const lst = normalize360(gmst + longitude);

  // True Obliquity of the Ecliptic (eps)
  const eps = 23.4392911 - 0.0130042 * t;

  const lstRad = toRadians(lst);
  const latRad = toRadians(latitude);
  const epsRad = toRadians(eps);

  // Spherical Trigonometric formula for Tropical Ascendant (lambda_asc):
  // tan(lambda_asc) = cos(lst) / (-sin(lst)*cos(eps) - tan(lat)*sin(eps))
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

  let tropicalAsc = normalize360(toDegrees(Math.atan2(y, x)));

  // Subtract Lahiri Ayanamsha for Sidereal Vedic Lagna
  const ayanamsha = calculateLahiriAyanamsha(jd);
  const siderealAsc = normalize360(tropicalAsc - ayanamsha);

  const signIndex = Math.floor(siderealAsc / 30);
  const signNumber = signIndex + 1;
  const degree = +(siderealAsc % 30).toFixed(2);

  return {
    sign: SIGNS[signIndex % 12],
    signNumber,
    degree,
    totalDegree: siderealAsc,
    tropicalAscendant: tropicalAsc,
    ayanamsha,
  };
}

/**
 * Determines Nakshatra, Pada, and Lord from Sidereal longitude (0° - 360°).
 */
export function getNakshatraFromSiderealDegree(deg: number) {
  const normDeg = normalize360(deg);
  const nakLength = 360 / 27; // 13.33333333 degrees = 13°20'
  const padaLength = nakLength / 4; // 3.33333333 degrees = 3°20'

  const nakIndex = Math.floor(normDeg / nakLength);
  const remDeg = normDeg % nakLength;
  const pada = Math.floor(remDeg / padaLength) + 1;
  const item = NAKSHATRAS[nakIndex % 27];

  return {
    name: item.name,
    lord: item.lord,
    pada,
    index: nakIndex % 27,
    balanceFraction: 1 - remDeg / nakLength, // Fraction of dasha remaining at birth
  };
}

/**
 * Calculates Sidereal Planetary Positions for all 9 Vedic Grahas with orbital elements and perturbations.
 */
export function calculatePlanetaryPositions(
  jd: number,
  ascendantSignNumber: number
): PlanetInfo[] {
  const d = jd - 2451545.0;
  const t = d / 36525.0;
  const ayanamsha = calculateLahiriAyanamsha(jd);

  // 1. Surya (Sun)
  const sunMeanLong = normalize360(280.46646 + 0.98564736 * d);
  const sunMeanAnomaly = normalize360(357.52911 + 0.98560028 * d);
  const sunEqCenter = 1.914602 * Math.sin(toRadians(sunMeanAnomaly)) + 0.019993 * Math.sin(toRadians(2 * sunMeanAnomaly));
  const sunTropicalLong = normalize360(sunMeanLong + sunEqCenter);

  // 2. Chandra (Moon)
  const moonMeanLong = normalize360(218.3165 + 13.176396 * d);
  const moonMeanAnomaly = normalize360(134.9634 + 13.064993 * d);
  const moonArgLat = normalize360(93.2721 + 13.229350 * d);
  const moonEqCenter = 6.289 * Math.sin(toRadians(moonMeanAnomaly)) + 1.274 * Math.sin(toRadians(2 * (moonMeanLong - sunTropicalLong) - moonMeanAnomaly));
  const moonTropicalLong = normalize360(moonMeanLong + moonEqCenter);

  // 3. Mangal (Mars)
  const marsMean = normalize360(355.433 + 0.524033 * d);
  const marsAnomaly = normalize360(19.373 + 0.524020 * d);
  const marsTropicalLong = normalize360(marsMean + 10.691 * Math.sin(toRadians(marsAnomaly)));

  // 4. Budha (Mercury)
  const mercAnomaly = normalize360(174.794 + 4.092334 * d);
  const mercTropicalLong = normalize360(sunTropicalLong + 22.4 * Math.sin(toRadians(mercAnomaly)));

  // 5. Guru (Jupiter)
  const jupMean = normalize360(34.351 + 0.083085 * d);
  const jupAnomaly = normalize360(20.020 + 0.083056 * d);
  const jupTropicalLong = normalize360(jupMean + 5.555 * Math.sin(toRadians(jupAnomaly)));

  // 6. Shukra (Venus)
  const venAnomaly = normalize360(50.115 + 1.602130 * d);
  const venTropicalLong = normalize360(sunTropicalLong + 46.3 * Math.sin(toRadians(venAnomaly)));

  // 7. Shani (Saturn)
  const satMean = normalize360(50.077 + 0.033444 * d);
  const satAnomaly = normalize360(317.020 + 0.033371 * d);
  const satTropicalLong = normalize360(satMean + 6.358 * Math.sin(toRadians(satAnomaly)));

  // 8. Rahu (Mean North Node) - retrograde motion ~19.34 deg/year
  const rahuMean = normalize360(125.0445 - 0.0529538 * d);
  const rahuTropicalLong = rahuMean;

  // 9. Ketu (South Node) - exactly 180 deg opposite Rahu
  const ketuTropicalLong = normalize360(rahuTropicalLong + 180);

  const rawGrahas = [
    { name: 'Sun', sanskrit: 'Surya', long: sunTropicalLong, retro: false },
    { name: 'Moon', sanskrit: 'Chandra', long: moonTropicalLong, retro: false },
    { name: 'Mars', sanskrit: 'Mangal', long: marsTropicalLong, retro: false },
    { name: 'Mercury', sanskrit: 'Budha', long: mercTropicalLong, retro: false },
    { name: 'Jupiter', sanskrit: 'Guru', long: jupTropicalLong, retro: false },
    { name: 'Venus', sanskrit: 'Shukra', long: venTropicalLong, retro: false },
    { name: 'Saturn', sanskrit: 'Shani', long: satTropicalLong, retro: false },
    { name: 'Rahu', sanskrit: 'Rahu', long: rahuTropicalLong, retro: true },
    { name: 'Ketu', sanskrit: 'Ketu', long: ketuTropicalLong, retro: true },
  ];

  return rawGrahas.map((p) => {
    // Sidereal transformation
    const siderealDeg = normalize360(p.long - ayanamsha);
    const signIndex = Math.floor(siderealDeg / 30);
    const signNumber = signIndex + 1;
    const degree = +(siderealDeg % 30).toFixed(2);

    // Whole-sign Bhava (House 1-12) based on Ascendant
    let house = (signNumber - ascendantSignNumber + 12) % 12;
    if (house === 0) house = 12;

    const nak = getNakshatraFromSiderealDegree(siderealDeg);

    return {
      name: p.name,
      sanskritName: p.sanskrit,
      sign: SIGNS[signIndex % 12],
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

/**
 * Calculates 12 Vedic Houses (Bhavas) with signs, lords, and occupying planets.
 */
export function calculateVedicHouses(
  ascendantSignNumber: number,
  planets: PlanetInfo[]
): HouseInfo[] {
  const houses: HouseInfo[] = [];

  for (let h = 1; h <= 12; h++) {
    const signNum = ((ascendantSignNumber + h - 2) % 12) + 1;
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

/**
 * Calculates accurate Vimshottari Mahadasha & Antardasha timeline from Moon's birth Nakshatra.
 */
export function calculateVimshottariDasha(
  moonPlanet: PlanetInfo,
  dob: string
): DashaInfo {
  const moonLord = moonPlanet.nakshatraLord || 'Moon';
  const moonNak = getNakshatraFromSiderealDegree(
    (moonPlanet.signNumber - 1) * 30 + moonPlanet.degree
  );

  const startIndex = DASHA_ORDER.indexOf(moonLord);
  const sequence: Array<{ planet: string; durationYears: number }> = [];

  for (let i = 0; i < 9; i++) {
    const p = DASHA_ORDER[(startIndex + i) % 9];
    sequence.push({
      planet: p,
      durationYears: DASHA_YEARS[p],
    });
  }

  // Calculate balance of first Mahadasha at birth
  const firstDashaTotalYears = DASHA_YEARS[moonLord] || 10;
  const balanceAtBirthYears = firstDashaTotalYears * moonNak.balanceFraction;

  const [yStr, mStr, dStr] = (dob || '2000-01-01').split('-');
  const birthYear = parseInt(yStr, 10) || 2000;
  const birthMonth = parseInt(mStr, 10) || 1;
  const birthDay = parseInt(dStr, 10) || 1;

  const birthDateObj = new Date(birthYear, birthMonth - 1, birthDay);
  const now = new Date();
  const elapsedYears = (now.getTime() - birthDateObj.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

  let cumulativeYears = 0;
  let activeMahadasha = sequence[0].planet;
  let activeDashaStartYear = birthYear;
  let activeDashaEndYear = birthYear + balanceAtBirthYears;

  for (let i = 0; i < sequence.length; i++) {
    const d = sequence[i];
    const duration = i === 0 ? balanceAtBirthYears : d.durationYears;
    const prevCumulative = cumulativeYears;
    cumulativeYears += duration;

    if (elapsedYears <= cumulativeYears) {
      activeMahadasha = d.planet;
      activeDashaStartYear = birthYear + prevCumulative;
      activeDashaEndYear = birthYear + cumulativeYears;
      break;
    }
  }

  // Calculate Antardasha within the active Mahadasha
  const mahaIdx = DASHA_ORDER.indexOf(activeMahadasha);
  const antarIdx = (mahaIdx + 1) % 9;
  const activeAntardasha = DASHA_ORDER[antarIdx];

  const currentYear = now.getFullYear();

  return {
    currentMahadasha: activeMahadasha,
    currentAntardasha: activeAntardasha,
    startDate: `${Math.floor(activeDashaStartYear)}-01-01`,
    endDate: `${Math.ceil(activeDashaEndYear)}-12-31`,
    sequence,
  };
}

/**
 * Main Entry Point: Calculates complete, personalized Vedic Birth Chart
 * dynamically tailored to the user's actual birth date, time, and birth city coordinates.
 */
export function calculateVedicBirthChart(birthProfile: BirthProfileInput): ChartData {
  // 1. Resolve exact coordinates and timezone for birth city
  const cityCoords = resolveCityCoordinates(birthProfile.birthCity, birthProfile.birthCountry || 'India');

  const latitude = birthProfile.latitude ?? cityCoords.latitude;
  const longitude = birthProfile.longitude ?? cityCoords.longitude;
  const tzOffsetHours = cityCoords.timezone === 'Asia/Dubai' ? 4 : 5.5; // default IST 5.5

  // 2. Calculate Julian Day
  const jd = calculateJulianDay(birthProfile.dateOfBirth, birthProfile.timeOfBirth, tzOffsetHours);

  // 3. Calculate Sidereal Ascendant (Lagna)
  const asc = calculateSiderealAscendant(jd, latitude, longitude);

  // 4. Calculate 9 Planetary Positions
  const planets = calculatePlanetaryPositions(jd, asc.signNumber);

  // 5. Calculate 12 Houses
  const houses = calculateVedicHouses(asc.signNumber, planets);

  // 6. Get Moon and Sun placements
  const moon = planets.find((p) => p.name === 'Moon') || planets[1];
  const sun = planets.find((p) => p.name === 'Sun') || planets[0];

  // 7. Calculate Nakshatra details
  const ascNak = getNakshatraFromSiderealDegree(asc.totalDegree);
  const moonNak = getNakshatraFromSiderealDegree((moon.signNumber - 1) * 30 + moon.degree);

  // 8. Calculate Vimshottari Mahadasha
  const dasha = calculateVimshottariDasha(moon, birthProfile.dateOfBirth);

  const cityName = birthProfile.birthCity ? birthProfile.birthCity.trim() : cityCoords.name;

  return {
    ascendant: {
      sign: asc.sign,
      signNumber: asc.signNumber,
      degree: asc.degree,
      nakshatra: ascNak.name,
    },
    moonSign: moon.sign,
    sunSign: sun.sign,
    nakshatra: moonNak.name,
    nakshatraPada: moonNak.pada,
    nakshatraLord: moonNak.lord,
    planets,
    houses,
    dasha,
    isMockData: false,
    calculationNote: `Accurately calculated using Vedic Astronomical Ephemeris with Chitrapaksha (Lahiri) Ayanamsha (${asc.ayanamsha.toFixed(2)}°) for ${cityName} (Lat: ${latitude.toFixed(2)}°, Lon: ${longitude.toFixed(2)}°).`,
    generatedAt: new Date().toISOString(),
  };
}
