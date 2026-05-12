import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('gold-price')
  async getPrice() {
    return this.marketService.getGoldPrice();
  }

  @Get('crypto')
  async getCrypto(@Query('coin') coin: string) {
    const coinId = coin || 'bitcoin';
    return this.marketService.getCryptoPrice(coinId);
  }

  @Get('news')
  @UseGuards(JwtAuthGuard)
  async getNews() {
    return this.marketService.getGoldNews();
  }

  @Get('analytics')
  async getAnalytics(
    @Query('symbol') symbol: string = 'BTCUSDT',
    @Query('interval') interval: string = '5m',
    @Query('limit') limit: string = '20',
  ) {
    return this.marketService.getAnalytics(symbol, interval, parseInt(limit));
  }
}