import { AstrologyProvider } from './provider.interface';
import { BirthProfileInput, ChartData, PlanetInfo, HouseInfo, DashaInfo } from './types';
import { calculateVedicBirthChart } from './vedic-calculator';

export class MockAstrologyProvider implements AstrologyProvider {
  name = 'Vedic Astronomical Algorithmic Engine (Lahiri Precision)';

  async generateBirthChart(birthProfile: BirthProfileInput): Promise<ChartData> {
    return calculateVedicBirthChart(birthProfile);
  }

  async getAscendant(birthProfile: BirthProfileInput): Promise<{ sign: string; signNumber: number; degree: number }> {
    const chart = calculateVedicBirthChart(birthProfile);
    return {
      sign: chart.ascendant.sign,
      signNumber: chart.ascendant.signNumber,
      degree: chart.ascendant.degree,
    };
  }

  async getPlanetaryPositions(birthProfile: BirthProfileInput): Promise<PlanetInfo[]> {
    const chart = calculateVedicBirthChart(birthProfile);
    return chart.planets;
  }

  async getHouses(birthProfile: BirthProfileInput): Promise<HouseInfo[]> {
    const chart = calculateVedicBirthChart(birthProfile);
    return chart.houses;
  }

  async getNakshatra(birthProfile: BirthProfileInput): Promise<{ name: string; pada: number; lord: string }> {
    const chart = calculateVedicBirthChart(birthProfile);
    return {
      name: chart.nakshatra,
      pada: chart.nakshatraPada,
      lord: chart.nakshatraLord,
    };
  }

  async getDasha(birthProfile: BirthProfileInput): Promise<DashaInfo> {
    const chart = calculateVedicBirthChart(birthProfile);
    return chart.dasha;
  }

  async getChartData(birthProfile: BirthProfileInput): Promise<ChartData> {
    return calculateVedicBirthChart(birthProfile);
  }
}
