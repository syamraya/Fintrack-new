import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

private getMockAnalytics(reason: string) {
  return {
    sentiment: 'Neutral',
    trendScore: Math.floor(Math.random() * 100),
    volatility: Math.floor(Math.random() * 100),
    price: 42000 + Math.random() * 500,
    time: new Date().toISOString(),
    source: 'mock',
    debug: reason,
  };
}
  // GoldAPI menggunakan URL berdasarkan simbol di path-nya
  private readonly baseUrl = 'https://www.goldapi.io/api/XAU/USD';
  getGoldNews: any;

  async getCryptoPrice(coinId: string = 'bitcoin') {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd,idr', // Kita ambil USD dan IDR sekaligus
            include_24hr_change: 'true',
            include_last_updated_at: 'true',
          },
        },
      );

      const data = response.data[coinId.toLowerCase()];

      if (!data) {
        throw new Error('Koin tidak ditemukan, bre!');
      }

      return {
        symbol: coinId.toUpperCase(),
        price_usd: data.usd,
        price_idr: data.idr,
        change_24h: data.usd_24h_change,
        last_updated: new Date(data.last_updated_at * 1000).toISOString(),
      };
    } catch (error: any) {
      this.logger.error(
        `Gagal ambil harga Crypto (${coinId}): ${error.message}`,
      );
      throw new InternalServerErrorException(
        'Gagal mengambil data crypto, pastikan ID koin benar.',
      );
    }
  }

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
        this.logger.error(
          `GoldAPI Error: ${response.data?.error || 'Unknown Error'}`,
        );
        return this.getMockGoldPrice('API Key bermasalah');
      }

      return {
        from: 'XAU',
        to: 'USD',
        price: response.data.price, // Harga per ounce (misal 2320.55)
        high: response.data.high,
        low: response.data.low,
        lastRefreshed: new Date(response.data.timestamp * 1000).toISOString(),
        isMock: false,
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
      price: 2320.5 + Math.random() * 5,
      lastRefreshed: new Date().toISOString(),
      isMock: true,
      debugInfo: reason,
    };
  }

  // market.service.ts

  async getAnalytics() {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: 'CRYPTO_INTRADAY',
          symbol: 'BTC',
          market: 'USD',
          interval: '5min',
          apikey: process.env.ALPHA_API_KEY,
        },
      },
    );

    const raw = response.data;

    // 🛑 HANDLE ERROR RESPONSE FIRST
    if (!raw || raw['Note'] || raw['Error Message']) {
      this.logger.warn('AlphaVantage limit / error detected');

      return this.getMockAnalytics('API Limit / Error');
    }

    const data = raw['Time Series Crypto (5min)'];

    // 🛑 GUARD CLAUSE (INI YANG KAMU LUPA)
    if (!data) {
      this.logger.warn('No time series data found');

      return this.getMockAnalytics('Missing Time Series');
    }

    const latestKey = Object.keys(data)[0];
    const latest = data[latestKey];

    if (!latest) {
      return this.getMockAnalytics('Empty Latest Data');
    }

    return {
      price: latest['4. close'],
      high: latest['2. high'],
      low: latest['3. low'],
      volume: latest['5. volume'],
      time: latestKey,
    };
  } catch (error) {
    this.logger.error(error);

    return this.getMockAnalytics('Crash Fallback');
  }
}
}
