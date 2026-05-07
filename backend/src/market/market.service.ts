import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  // GoldAPI menggunakan URL berdasarkan simbol di path-nya
  private readonly baseUrl = 'https://www.goldapi.io/api/XAU/USD';
  getGoldNews: any;

  async getGoldPrice() {
    const apiKey = process.env.GOLD_API_KEY;

    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json',
        },
      });

      // GoldAPI return 200 tapi isinya bisa pesan error jika key salah
      if (!response.data || response.data.error) {
        this.logger.error(`GoldAPI Error: ${response.data?.error || 'Unknown Error'}`);
        return this.getMockGoldPrice('API Key bermasalah');
      }

      return {
        from: 'XAU',
        to: 'USD',
        price: response.data.price, // Harga per ounce (misal 2320.55)
        high: response.data.high,
        low: response.data.low,
        lastRefreshed: new Date(response.data.timestamp * 1000).toISOString(),
        isMock: false
      };

    } catch (error: any) {
      this.logger.error(`GoldAPI Crash: ${error.message}`);
      // Jika limit 100 request/bulan habis, otomatis pindah ke mock
      return this.getMockGoldPrice('Connection/Limit Error');
    }
  }

  private getMockGoldPrice(reason: string) {
    return {
      from: 'XAU',
      to: 'USD',
      price: 2320.50 + (Math.random() * 5),
      lastRefreshed: new Date().toISOString(),
      isMock: true,
      debugInfo: reason
    };
  }
}