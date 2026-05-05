import { Controller, Get, UseGuards } from '@nestjs/common';
import { MarketService } from './market.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('market')
@UseGuards(JwtAuthGuard) // Agar hanya user login yang bisa lihat
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get('gold-price')
  async getPrice() {
    return this.marketService.getGoldPrice();
  }

  @Get('news')
  async getNews() {
    return this.marketService.getGoldNews();
  }
}