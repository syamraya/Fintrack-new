import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly binanceUrl = 'https://api.binance.com/api/v3/klines';

  /**
   * 1. Ambil Harga Kripto (CoinGecko Public API)
   */
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

  /**
   * 2. Ambil Harga Emas XAU/USD (Binance PAXGUSDT)
   */
  async getGoldPrice() {
    try {
      const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        params: { symbol: 'PAXGUSDT' },
      });

      const data = response.data;

      if (!data || !data.lastPrice) {
        throw new Error('Gagal mengambil ticker PAXGUSDT dari Binance');
      }

      const price = parseFloat(data.lastPrice);
      const high = parseFloat(data.highPrice);
      const low = parseFloat(data.lowPrice);
      const prevClose = parseFloat(data.prevClosePrice);

      return {
        from: 'XAU',
        to: 'USD',
        price: price,
        high: high,
        low: low,
        prev_close_price: prevClose,
        lastRefreshed: new Date(data.closeTime).toISOString(),
        isMock: false,
        marketStatus: 'open',
        message: null,
      };
    } catch (error: any) {
      this.logger.error(`Binance Gold (PAXG) Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Data harga emas tidak tersedia saat ini.',
      );
    }
  }

  /**
   * 3. Ambil Berita Finansial (CryptoCompare Public API)
   */
  async getGoldNews() {
    try {
      const response = await axios.get(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN',
      );

      const articles = response.data?.Data || [];

      return articles.slice(0, 10).map((article: any) => ({
        title: article.title,
        description: article.body,
        content: article.body,
        url: article.url,
        image: article.imageurl,
        publishedAt: new Date(article.published_on * 1000).toISOString(),
        source: article.source_info?.name || article.source || 'CryptoCompare',
      }));
    } catch (error: any) {
      this.logger.error(`News API Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil berita finansial terbaru.',
      );
    }
  }

  /**
   * 4. Market Analytics Candle (Binance Public API)
   */
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
        (((high - low) / low) * 100).toFixed(2),
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

  /**
   * 5. Proxy Klines/Candle Data (Binance Public API)
   */
  async getKlines(
    symbol: string = 'BTCUSDT',
    interval: string = '5m',
    limit: number = 500,
  ) {
    try {
      const response = await axios.get(this.binanceUrl, {
        params: { symbol, interval, limit },
      });

      return response.data.map((c: any[]) => ({
        openTime: c[0],
        open: parseFloat(c[1]),
        high: parseFloat(c[2]),
        low: parseFloat(c[3]),
        close: parseFloat(c[4]),
        volume: parseFloat(c[5]),
        closeTime: c[6],
      }));
    } catch (error: any) {
      this.logger.error(`Get Klines Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil data klines dari Binance.',
      );
    }
  }
}