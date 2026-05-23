import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';

// ─────────────────────────────────────────────────────────────────
//  Bypass SSL verification — ISP (Telkom/IndiHome) menginterep
//  koneksi HTTPS sehingga sertifikat tidak bisa diverifikasi.
//  HANYA untuk development. Hapus di production.
// ─────────────────────────────────────────────────────────────────
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

// ── Simple in-memory cache ────────────────────────────────────────
const cache = new Map<string, { data: any; expiredAt: number }>();

function getCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiredAt) { cache.delete(key); return null; }
  return entry.data;
}

function setCache(key: string, data: any, ttlMs: number) {
  cache.set(key, { data, expiredAt: Date.now() + ttlMs });
}

// Semua coin yang didukung — fetch sekaligus 1 request ke CoinGecko
const SUPPORTED_COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple'];

const COIN_SYMBOL_MAP: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  binancecoin: 'BNB',
  ripple: 'XRP',
};

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);
  private readonly goldUrl = 'https://www.goldapi.io/api/XAU/USD';
  private readonly binanceUrl = 'https://api.binance.com/api/v3/klines';

  // ── Fetch semua coin sekaligus, cache 2 menit ─────────────────
  private async fetchAllCryptoPrices() {
    const cacheKey = 'crypto_all';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        httpsAgent,
        params: {
          ids: SUPPORTED_COINS.join(','),
          vs_currencies: 'usd,idr',
          include_24hr_change: 'true',
          include_last_updated_at: 'true',
        },
      },
    );

    setCache(cacheKey, response.data, 120_000);
    return response.data;
  }

  // ── Crypto price (CoinGecko) ──────────────────────────────────
  async getCryptoPrice(coinId: string = 'bitcoin') {
    const id = coinId.toLowerCase();
    try {
      const allData = await this.fetchAllCryptoPrices();
      const data = allData[id];

      if (!data) throw new Error(`Koin tidak ditemukan: ${id}`);

      return {
        symbol: COIN_SYMBOL_MAP[id] ?? id.toUpperCase(),
        price_usd: data.usd,
        price_idr: data.idr,
        change_24h: data.usd_24h_change,
        last_updated: new Date(data.last_updated_at * 1000).toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Gagal ambil harga Crypto (${coinId}): ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil data crypto, pastikan ID koin benar.',
      );
    }
  }

  // ── Gold price (GoldAPI) ──────────────────────────────────────
  async getGoldPrice() {
    const apiKey = process.env.GOLD_API_KEY;

    try {
      const response = await axios.get(this.goldUrl, {
        httpsAgent,
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

  // ── News (GNews) ──────────────────────────────────────────────
  //  Return [] kalau gagal — jangan throw, biar FE pakai mock.
  async getGoldNews() {
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
      this.logger.warn('GNEWS_API_KEY belum di-set, return array kosong');
      return [];
    }

    try {
      const response = await axios.get('https://gnews.io/api/v4/search', {
        httpsAgent,
        params: {
          q: 'gold market OR crypto OR bitcoin OR finance',
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
      return [];
    }
  }

  // ── Analytics (Binance) ───────────────────────────────────────
  async getAnalytics(
    symbol: string = 'BTCUSDT',
    interval: string = '5m',
    limit: number = 20,
  ) {
    try {
      const response = await axios.get(this.binanceUrl, {
        httpsAgent,
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

      const volatility = parseFloat((((high - low) / low) * 100).toFixed(2));
      const trendScore = parseFloat((((close - oldest) / oldest) * 100).toFixed(2));
      const sentiment = trendScore > 0 ? 'Bullish' : trendScore < 0 ? 'Bearish' : 'Neutral';

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

  // ── Klines proxy (Binance) ────────────────────────────────────
  //  FE tidak bisa hit Binance langsung karena diblokir ISP.
  //  Semua request chart diproxy lewat sini.
  //  Cache 30 detik supaya tidak spam saat chart re-render.
  async getKlines(
    symbol: string = 'BTCUSDT',
    interval: string = '5m',
    limit: number = 500,
  ) {
    const cacheKey = `klines_${symbol}_${interval}_${limit}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(this.binanceUrl, {
        httpsAgent,
        params: { symbol, interval, limit },
      });
      setCache(cacheKey, response.data, 30_000);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Klines Error: ${error.message}`);
      throw new InternalServerErrorException(
        'Gagal mengambil data klines dari Binance.',
      );
    }
  }
}