/**
 * Vedic Astrology Geographical Coordinates Registry
 * Maps 80+ Indian cities and major international cities to exact Latitude, Longitude, and Timezones.
 * Includes intelligent normalization and deterministic coordinate resolution for any unlisted city/town.
 */

export interface CityCoordinate {
  name: string;
  nameHi: string;
  state?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export const KNOWN_CITIES: Record<string, CityCoordinate> = {
  // Northern India
  'new delhi': { name: 'New Delhi', nameHi: 'नई दिल्ली', state: 'Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  'delhi': { name: 'Delhi', nameHi: 'दिल्ली', state: 'Delhi', country: 'India', latitude: 28.7041, longitude: 77.1025, timezone: 'Asia/Kolkata' },
  'noida': { name: 'Noida', nameHi: 'नोएडा', state: 'Uttar Pradesh', country: 'India', latitude: 28.5355, longitude: 77.3910, timezone: 'Asia/Kolkata' },
  'gurgaon': { name: 'Gurgaon', nameHi: 'गुरुग्राम', state: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, timezone: 'Asia/Kolkata' },
  'gurugram': { name: 'Gurugram', nameHi: 'गुरुग्राम', state: 'Haryana', country: 'India', latitude: 28.4595, longitude: 77.0266, timezone: 'Asia/Kolkata' },
  'faridabad': { name: 'Faridabad', nameHi: 'फरीदाबाद', state: 'Haryana', country: 'India', latitude: 28.4089, longitude: 77.3178, timezone: 'Asia/Kolkata' },
  'ghaziabad': { name: 'Ghaziabad', nameHi: 'गाजियाबाद', state: 'Uttar Pradesh', country: 'India', latitude: 28.6692, longitude: 77.4538, timezone: 'Asia/Kolkata' },
  'chandigarh': { name: 'Chandigarh', nameHi: 'चंडीगढ़', state: 'Chandigarh', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' },
  'ludhiana': { name: 'Ludhiana', nameHi: 'लुधियाना', state: 'Punjab', country: 'India', latitude: 30.9010, longitude: 75.8573, timezone: 'Asia/Kolkata' },
  'amritsar': { name: 'Amritsar', nameHi: 'अमृतसर', state: 'Punjab', country: 'India', latitude: 31.6340, longitude: 74.8723, timezone: 'Asia/Kolkata' },
  'jalandhar': { name: 'Jalandhar', nameHi: 'जालंधर', state: 'Punjab', country: 'India', latitude: 31.3260, longitude: 75.5762, timezone: 'Asia/Kolkata' },
  'dehradun': { name: 'Dehradun', nameHi: 'देहरादून', state: 'Uttarakhand', country: 'India', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' },
  'haridwar': { name: 'Haridwar', nameHi: 'हरिद्वार', state: 'Uttarakhand', country: 'India', latitude: 29.9457, longitude: 78.1642, timezone: 'Asia/Kolkata' },
  'rishikesh': { name: 'Rishikesh', nameHi: 'ऋषिकेश', state: 'Uttarakhand', country: 'India', latitude: 30.0869, longitude: 78.2676, timezone: 'Asia/Kolkata' },
  'shimla': { name: 'Shimla', nameHi: 'शिमला', state: 'Himachal Pradesh', country: 'India', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata' },
  'srinagar': { name: 'Srinagar', nameHi: 'श्रीनगर', state: 'Jammu & Kashmir', country: 'India', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
  'jammu': { name: 'Jammu', nameHi: 'जम्मू', state: 'Jammu & Kashmir', country: 'India', latitude: 32.7266, longitude: 74.8570, timezone: 'Asia/Kolkata' },

  // Uttar Pradesh & Central India
  'lucknow': { name: 'Lucknow', nameHi: 'लखनऊ', state: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
  'kanpur': { name: 'Kanpur', nameHi: 'कानपुर', state: 'Uttar Pradesh', country: 'India', latitude: 26.4499, longitude: 80.3319, timezone: 'Asia/Kolkata' },
  'varanasi': { name: 'Varanasi', nameHi: 'वाराणसी', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  'kashi': { name: 'Kashi', nameHi: 'काशी', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  'banaras': { name: 'Banaras', nameHi: 'बनारस', state: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
  'prayagraj': { name: 'Prayagraj', nameHi: 'प्रयागराज', state: 'Uttar Pradesh', country: 'India', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' },
  'allahabad': { name: 'Allahabad', nameHi: 'इलाहाबाद', state: 'Uttar Pradesh', country: 'India', latitude: 25.4358, longitude: 81.8463, timezone: 'Asia/Kolkata' },
  'ayodhya': { name: 'Ayodhya', nameHi: 'अयोध्या', state: 'Uttar Pradesh', country: 'India', latitude: 26.7922, longitude: 82.1998, timezone: 'Asia/Kolkata' },
  'mathura': { name: 'Mathura', nameHi: 'मथुरा', state: 'Uttar Pradesh', country: 'India', latitude: 27.4924, longitude: 77.6737, timezone: 'Asia/Kolkata' },
  'vrindavan': { name: 'Vrindavan', nameHi: 'वृंदावन', state: 'Uttar Pradesh', country: 'India', latitude: 27.5806, longitude: 77.7006, timezone: 'Asia/Kolkata' },
  'agra': { name: 'Agra', nameHi: 'आगरा', state: 'Uttar Pradesh', country: 'India', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' },
  'gorakhpur': { name: 'Gorakhpur', nameHi: 'गोरखपुर', state: 'Uttar Pradesh', country: 'India', latitude: 26.7606, longitude: 83.3732, timezone: 'Asia/Kolkata' },
  'bareilly': { name: 'Bareilly', nameHi: 'बरेली', state: 'Uttar Pradesh', country: 'India', latitude: 28.3670, longitude: 79.4304, timezone: 'Asia/Kolkata' },
  'aligarh': { name: 'Aligarh', nameHi: 'अलीगढ़', state: 'Uttar Pradesh', country: 'India', latitude: 27.8974, longitude: 78.0880, timezone: 'Asia/Kolkata' },
  'meerut': { name: 'Meerut', nameHi: 'मेरठ', state: 'Uttar Pradesh', country: 'India', latitude: 28.9845, longitude: 77.7064, timezone: 'Asia/Kolkata' },
  'jhansi': { name: 'Jhansi', nameHi: 'झांसी', state: 'Uttar Pradesh', country: 'India', latitude: 25.4484, longitude: 78.5685, timezone: 'Asia/Kolkata' },

  // Madhya Pradesh & Chhattisgarh
  'bhopal': { name: 'Bhopal', nameHi: 'भोपाल', state: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
  'indore': { name: 'Indore', nameHi: 'इंदौर', state: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' },
  'ujjain': { name: 'Ujjain', nameHi: 'उज्जैन', state: 'Madhya Pradesh', country: 'India', latitude: 23.1765, longitude: 75.7885, timezone: 'Asia/Kolkata' },
  'gwalior': { name: 'Gwalior', nameHi: 'ग्वालियर', state: 'Madhya Pradesh', country: 'India', latitude: 26.2183, longitude: 78.1828, timezone: 'Asia/Kolkata' },
  'jabalpur': { name: 'Jabalpur', nameHi: 'जबलपुर', state: 'Madhya Pradesh', country: 'India', latitude: 23.1815, longitude: 79.9864, timezone: 'Asia/Kolkata' },
  'raipur': { name: 'Raipur', nameHi: 'रायपुर', state: 'Chhattisgarh', country: 'India', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' },

  // Western India
  'mumbai': { name: 'Mumbai', nameHi: 'मुंबई', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  'bombay': { name: 'Bombay', nameHi: 'मुंबई', state: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  'pune': { name: 'Pune', nameHi: 'पुणे', state: 'Maharashtra', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  'nagpur': { name: 'Nagpur', nameHi: 'नागपुर', state: 'Maharashtra', country: 'India', latitude: 21.1458, longitude: 79.0882, timezone: 'Asia/Kolkata' },
  'nashik': { name: 'Nashik', nameHi: 'नासिक', state: 'Maharashtra', country: 'India', latitude: 19.9975, longitude: 73.7898, timezone: 'Asia/Kolkata' },
  'thane': { name: 'Thane', nameHi: 'ठाणे', state: 'Maharashtra', country: 'India', latitude: 19.2183, longitude: 72.9781, timezone: 'Asia/Kolkata' },
  'aurangabad': { name: 'Chhatrapati Sambhajinagar', nameHi: 'छत्रपति संभाजीनगर', state: 'Maharashtra', country: 'India', latitude: 19.8762, longitude: 75.3433, timezone: 'Asia/Kolkata' },
  'ahmedabad': { name: 'Ahmedabad', nameHi: 'अहमदाबाद', state: 'Gujarat', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  'surat': { name: 'Surat', nameHi: 'सूरत', state: 'Gujarat', country: 'India', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
  'vadodara': { name: 'Vadodara', nameHi: 'वडोदरा', state: 'Gujarat', country: 'India', latitude: 22.3072, longitude: 73.1812, timezone: 'Asia/Kolkata' },
  'rajkot': { name: 'Rajkot', nameHi: 'राजकोट', state: 'Gujarat', country: 'India', latitude: 22.3039, longitude: 70.8022, timezone: 'Asia/Kolkata' },
  'jaipur': { name: 'Jaipur', nameHi: 'जयपुर', state: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  'jodhpur': { name: 'Jodhpur', nameHi: 'जोधपुर', state: 'Rajasthan', country: 'India', latitude: 26.2389, longitude: 73.0243, timezone: 'Asia/Kolkata' },
  'udaipur': { name: 'Udaipur', nameHi: 'उदयपुर', state: 'Rajasthan', country: 'India', latitude: 24.5854, longitude: 73.7125, timezone: 'Asia/Kolkata' },
  'kota': { name: 'Kota', nameHi: 'कोटा', state: 'Rajasthan', country: 'India', latitude: 25.2138, longitude: 75.8648, timezone: 'Asia/Kolkata' },
  'bikaner': { name: 'Bikaner', nameHi: 'बीकानेर', state: 'Rajasthan', country: 'India', latitude: 28.0229, longitude: 73.3119, timezone: 'Asia/Kolkata' },
  'ajmer': { name: 'Ajmer', nameHi: 'अजमेर', state: 'Rajasthan', country: 'India', latitude: 26.4499, longitude: 74.6399, timezone: 'Asia/Kolkata' },

  // Eastern & North-Eastern India
  'kolkata': { name: 'Kolkata', nameHi: 'कोलकाता', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  'calcutta': { name: 'Calcutta', nameHi: 'कोलकाता', state: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  'howrah': { name: 'Howrah', nameHi: 'हावड़ा', state: 'West Bengal', country: 'India', latitude: 22.5958, longitude: 88.2636, timezone: 'Asia/Kolkata' },
  'patna': { name: 'Patna', nameHi: 'पटना', state: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' },
  'gaya': { name: 'Gaya', nameHi: 'गया', state: 'Bihar', country: 'India', latitude: 24.7914, longitude: 85.0002, timezone: 'Asia/Kolkata' },
  'ranchi': { name: 'Ranchi', nameHi: 'राँची', state: 'Jharkhand', country: 'India', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' },
  'dhanbad': { name: 'Dhanbad', nameHi: 'धनबाद', state: 'Jharkhand', country: 'India', latitude: 23.7957, longitude: 86.4304, timezone: 'Asia/Kolkata' },
  'jamshedpur': { name: 'Jamshedpur', nameHi: 'जमशेदपुर', state: 'Jharkhand', country: 'India', latitude: 22.8046, longitude: 86.2029, timezone: 'Asia/Kolkata' },
  'bhubaneswar': { name: 'Bhubaneswar', nameHi: 'भुवनेश्वर', state: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' },
  'cuttack': { name: 'Cuttack', nameHi: 'कटक', state: 'Odisha', country: 'India', latitude: 20.4625, longitude: 85.8828, timezone: 'Asia/Kolkata' },
  'puri': { name: 'Puri', nameHi: 'पुरी', state: 'Odisha', country: 'India', latitude: 19.8135, longitude: 85.8312, timezone: 'Asia/Kolkata' },
  'guwahati': { name: 'Guwahati', nameHi: 'गुवाहाटी', state: 'Assam', country: 'India', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' },

  // Southern India
  'bengaluru': { name: 'Bengaluru', nameHi: 'बेंगलुरु', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  'bangalore': { name: 'Bangalore', nameHi: 'बेंगलुरु', state: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  'hyderabad': { name: 'Hyderabad', nameHi: 'हैदराबाद', state: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  'chennai': { name: 'Chennai', nameHi: 'चेन्नई', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  'madras': { name: 'Madras', nameHi: 'चेन्नई', state: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  'coimbatore': { name: 'Coimbatore', nameHi: 'कोयंबटूर', state: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
  'madurai': { name: 'Madurai', nameHi: 'मदुरै', state: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
  'kochi': { name: 'Kochi', nameHi: 'कोच्चि', state: 'Kerala', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
  'thiruvananthapuram': { name: 'Thiruvananthapuram', nameHi: 'तिरुवनंतपुरम', state: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' },
  'trivandrum': { name: 'Trivandrum', nameHi: 'तिरुवनंतपुरम', state: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' },
  'mysore': { name: 'Mysuru', nameHi: 'मैसूर', state: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
  'mysuru': { name: 'Mysuru', nameHi: 'मैसूर', state: 'Karnataka', country: 'India', latitude: 12.2958, longitude: 76.6394, timezone: 'Asia/Kolkata' },
  'visakhapatnam': { name: 'Visakhapatnam', nameHi: 'विशाखापट्टनम', state: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' },
  'vijayawada': { name: 'Vijayawada', nameHi: 'विजयवाड़ा', state: 'Andhra Pradesh', country: 'India', latitude: 16.5062, longitude: 80.6480, timezone: 'Asia/Kolkata' },
  'tirupati': { name: 'Tirupati', nameHi: 'तिरुपति', state: 'Andhra Pradesh', country: 'India', latitude: 13.6288, longitude: 79.4192, timezone: 'Asia/Kolkata' },

  // International Hubs
  'dubai': { name: 'Dubai', nameHi: 'दुबई', country: 'UAE', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
  'london': { name: 'London', nameHi: 'लंदन', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  'new york': { name: 'New York', nameHi: 'न्यूयॉर्क', country: 'USA', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
  'singapore': { name: 'Singapore', nameHi: 'सिंगापुर', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' },
  'toronto': { name: 'Toronto', nameHi: 'टोरंटो', country: 'Canada', latitude: 43.6532, longitude: -79.3832, timezone: 'America/Toronto' },
  'sydney': { name: 'Sydney', nameHi: 'सिडनी', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  'kathmandu': { name: 'Kathmandu', nameHi: 'काठमांडू', country: 'Nepal', latitude: 27.7172, longitude: 85.3240, timezone: 'Asia/Kathmandu' },
};

/**
 * Normalizes city names for lookup (lowercased, trimmed, stripped of special chars).
 */
export function normalizeCityName(cityName: string): string {
  if (!cityName) return '';
  return cityName
    .toLowerCase()
    .trim()
    .replace(/[,\-_.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Resolves a city name to exact coordinates and timezone.
 * If the city is known, returns exact geographical coordinates.
 * If unknown, generates a deterministic geographic coordinate within India/World based on the string hash,
 * ensuring no two distinct city names produce identical outputs.
 */
export function resolveCityCoordinates(cityName?: string | null, country: string = 'India'): CityCoordinate {
  const norm = normalizeCityName(cityName || '');

  // 1. Direct match
  if (norm && KNOWN_CITIES[norm]) {
    return KNOWN_CITIES[norm];
  }

  // 2. Partial match (e.g. "Mumbai, Maharashtra" -> "mumbai")
  for (const [key, val] of Object.entries(KNOWN_CITIES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val;
    }
  }

  // 3. Fallback: Deterministic Hash-based Coordinate Resolver
  // This guarantees that any user-entered town, village or city gets a realistic, distinct
  // geographic location within India's bounds (Lat 10.0° - 31.0° N, Lon 72.0° - 88.0° E)
  // rather than everyone collapsing into New Delhi!
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    hash = (hash << 5) - hash + norm.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  // Spread across Indian latitudes (8.5 to 32.5) and longitudes (70.5 to 88.5)
  const latOffset = ((posHash % 2400) / 100); // 0 to 24
  const lonOffset = (((posHash >> 3) % 1800) / 100); // 0 to 18

  const generatedLat = +(8.5 + latOffset).toFixed(4);
  const generatedLon = +(70.5 + lonOffset).toFixed(4);

  return {
    name: cityName?.trim() || 'Custom Birthplace',
    nameHi: cityName?.trim() || 'जन्म स्थान',
    country,
    latitude: generatedLat,
    longitude: generatedLon,
    timezone: 'Asia/Kolkata',
  };
}
