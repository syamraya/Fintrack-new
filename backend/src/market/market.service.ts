import {Injectable,InternalServerErrorException,Logger,} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  private readonly baseUrl = 'https://www.goldapi.io/api/XAU/USD';
  private readonly binanceUrl = 'https://api.binance.com/api/v3/klines';
  getGoldNews: any;

  async getCryptoPrice(coinId: string = 'bitcoin') {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price',
        {
          params: {
            ids: coinId,
            vs_currencies: 'usd,idr',
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

      if (!response.data || response.data.error) {
        this.logger.error(
          `GoldAPI Error: ${response.data?.error || 'Unknown Error'}`,
        );
        throw new InternalServerErrorException(
          `GoldAPI error: ${response.data?.error || 'Unknown Error'}`,
        );
      }

      return {
        from: 'XAU',
        to: 'USD',
        price: response.data.price,
        high: response.data.high,
        low: response.data.low,
        lastRefreshed: new Date(response.data.timestamp * 1000).toISOString(),
        isMock: false,
      };
    } catch (error: any) {
      this.logger.error(`GoldAPI Crash: ${error.message}`);
      throw new InternalServerErrorException(
        'Data gold tidak tersedia saat ini.',
      );
    }
  }

  async getAnalytics(
    symbol: string = 'BTCUSDT',
    interval: string = '5m',
    limit: number = 20,
  ) {
    try {
      const response = await axios.get(this.binanceUrl, {
        params: { symbol, interval, limit },
      });

      const candles = response.data;

      if (!candles || candles.length === 0) {
        throw new Error('Tidak ada data candle dari Binance');
      }

      const latest = candles[candles.length - 1];
      const closes = candles.map((c: any[]) => parseFloat(c[4]));

      const high = parseFloat(latest[2]);
      const low = parseFloat(latest[3]);
      const close = parseFloat(latest[4]);
      const volume = parseFloat(latest[5]);
      const oldest = closes[0];

      const volatility = parseFloat(
        ((high - low) / low * 100).toFixed(2),
      );

      const trendScore = parseFloat(
        (((close - oldest) / oldest) * 100).toFixed(2),
      );

      const sentiment =
        trendScore > 0 ? 'Bullish' : trendScore < 0 ? 'Bearish' : 'Neutral';

      return {
        symbol,
        price: close,
        high,
        low,
        volume,
        volatility,
        trendScore,
        sentiment,
        time: new Date(latest[0]).toISOString(),
        source: 'binance',
        isMock: false,
      };
    } catch (error: any) {
      this.logger.error(`Binance Analytics Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil data analytics dari Binance.',
      );
    }
  }
}