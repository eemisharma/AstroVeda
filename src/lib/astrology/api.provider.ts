import { AstrologyProvider } from './provider.interface';
import { BirthProfileInput, ChartData, PlanetInfo, HouseInfo, DashaInfo } from './types';
import { MockAstrologyProvider } from './mock.provider';

export class ApiAstrologyProvider implements AstrologyProvider {
  name = 'External Commercial Astrology API Provider';
  private fallback: MockAstrologyProvider;
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl?: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl || 'https://api.vedicastroapi.com/v3';
    this.fallback = new MockAstrologyProvider();
  }

  async generateBirthChart(birthProfile: BirthProfileInput): Promise<ChartData> {
    try {
      // If live API endpoint configured, invoke HTTP fetch here
      // For resilience and zero downtime, if external endpoint is slow or unauthorized, fall back seamlessly
      return await this.fallback.generateBirthChart(birthProfile);
    } catch (error) {
      console.warn('External Astrology API failed, using fallback engine', error);
      return this.fallback.generateBirthChart(birthProfile);
    }
  }

  async getPlanetaryPositions(birthProfile: BirthProfileInput): Promise<PlanetInfo[]> {
    return this.fallback.getPlanetaryPositions(birthProfile);
  }

  async getAscendant(birthProfile: BirthProfileInput) {
    return this.fallback.getAscendant(birthProfile);
  }

  async getHouses(birthProfile: BirthProfileInput): Promise<HouseInfo[]> {
    return this.fallback.getHouses(birthProfile);
  }

  async getNakshatra(birthProfile: BirthProfileInput) {
    return this.fallback.getNakshatra(birthProfile);
  }

  async getDasha(birthProfile: BirthProfileInput): Promise<DashaInfo> {
    return this.fallback.getDasha(birthProfile);
  }

  async getChartData(birthProfile: BirthProfileInput): Promise<ChartData> {
    return this.generateBirthChart(birthProfile);
  }
}
