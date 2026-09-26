import { AstrologyProvider } from './provider.interface';
import { MockAstrologyProvider } from './mock.provider';
import { ApiAstrologyProvider } from './api.provider';

export * from './types';
export * from './provider.interface';

export function getAstrologyProvider(): AstrologyProvider {
  const apiKey = process.env.ASTROLOGY_API_KEY;
  const apiUrl = process.env.ASTROLOGY_API_URL;

  if (apiKey && apiKey.trim() !== '') {
    return new ApiAstrologyProvider(apiKey, apiUrl);
  }

  return new MockAstrologyProvider();
}

export const astrologyProvider = getAstrologyProvider();
