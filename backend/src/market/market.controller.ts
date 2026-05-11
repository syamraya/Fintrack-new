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
  @UseGuards(JwtAuthGuard) // hanya ini yang perlu login
  async getNews() {
    return this.marketService.getGoldNews();
  }

  @Get('analytics')
  getAnalytics() {
    return this.marketService.getAnalytics();
  }
}
