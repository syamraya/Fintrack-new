import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MarketService {
  private readonly apiKey = process.env.ALPHA_VANTAGE_KEY;
  private readonly baseUrl = 'https://www.alphavantage.co/query';

  async getGoldPrice() {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'CURRENCY_EXCHANGE_RATE',
          from_currency: 'XAU',
          to_currency: 'USD',
          apikey: this.apiKey,
        },
      });

      const data = response.data['Realtime Currency Exchange Rate'];
      if (!data) throw new Error('Limit API tercapai atau simbol salah');

      return {
        from: data['1. From_Currency Code'],
        to: data['3. To_Currency Code'],
        price: parseFloat(data['5. Exchange Rate']),
        lastRefreshed: data['6. Last Refreshed'],
      };
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil harga emas, bre!');
    }
  }

  async getGoldNews() {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'NEWS_SENTIMENT',
          tickers: 'FOREX:USD', // Berita terkait USD biasanya pengaruh ke XAU
          topics: 'economy_monetary',
          apikey: this.apiKey,
        },
      });

      // Ambil 5 berita teratas saja
      return response.data.feed?.slice(0, 5).map((news: any) => ({
        title: news.title,
        url: news.url,
        summary: news.summary,
        sentiment: news.overall_sentiment_label,
        banner: news.banner_image,
      }));
    } catch (error) {
      throw new InternalServerErrorException('Gagal mengambil berita market!');
    }
  }
}