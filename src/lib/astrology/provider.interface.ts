import { BirthProfileInput, ChartData, PlanetInfo, HouseInfo, DashaInfo } from './types';

export interface AstrologyProvider {
  name: string;
  generateBirthChart(birthProfile: BirthProfileInput): Promise<ChartData>;
  getPlanetaryPositions(birthProfile: BirthProfileInput): Promise<PlanetInfo[]>;
  getAscendant(birthProfile: BirthProfileInput): Promise<{ sign: string; signNumber: number; degree: number }>;
  getHouses(birthProfile: BirthProfileInput): Promise<HouseInfo[]>;
  getNakshatra(birthProfile: BirthProfileInput): Promise<{ name: string; pada: number; lord: string }>;
  getDasha(birthProfile: BirthProfileInput): Promise<DashaInfo>;
  getChartData(birthProfile: BirthProfileInput): Promise<ChartData>;
}
