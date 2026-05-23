import {Injectable,InternalServerErrorException,Logger,} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly baseUrl = 'https://www.goldapi.io/api/XAU/USD';
  private readonly binanceUrl = 'https://api.binance.com/api/v3/klines';

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

    const data = response.data;

    if (!data || data.error) {
      throw new InternalServerErrorException(
        `GoldAPI error: ${data?.error || 'Unknown Error'}`,
      );
    }

    const isMarketClosed = !data.price || data.price === 0;

    return {
      from: 'XAU',
      to: 'USD',
      price: data.price ?? null,
      high: data.high ?? null,
      low: data.low ?? null,
      prev_close_price: data.prev_close_price ?? null,
      lastRefreshed: data.timestamp
        ? new Date(data.timestamp * 1000).toISOString()
        : null,
      isMock: false,
      marketStatus: isMarketClosed ? 'closed' : 'open',
      message: isMarketClosed
        ? 'Market emas sedang tutup, menampilkan harga terakhir.'
        : null,
    };
  } catch (error: any) {
    this.logger.error(`GoldAPI Crash: ${error.message}`);
    throw new InternalServerErrorException(
      'Data gold tidak tersedia saat ini.',
    );
  }
}

async getGoldNews() {
    const apiKey = process.env.GNEWS_API_KEY;
    const query = 'gold market OR crypto OR finance';

    try {
      const response = await axios.get('https://gnews.io/api/v4/search', {
        params: {
          q: query,
          lang: 'en',          
          max: 10,            
          apikey: apiKey,
        },
      });

      const articles = response.data.articles || [];
      return articles.map((article: any) => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        image: article.image,
        publishedAt: article.publishedAt,
        source: article.source?.name || 'Unknown Source',
      }));

    } catch (error: any) {
      this.logger.error(`GNews API Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil berita finansial terbaru.',
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