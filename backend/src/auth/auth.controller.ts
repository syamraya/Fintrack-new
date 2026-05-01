import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express'; 
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';
import { Role } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('register')
async register(@Body() createUserDto: CreateUserDto) {
  return this.authService.register(createUserDto);
}

  @Post('login')
  login(@Body() loginDto: any) {
    return this.authService.login(loginDto.email, loginDto.password);
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get('user-dashboard')
  getProfile(@Req() req: Request) {
    return { message: 'Selamat datang di Wallet', user: req.user };
  }


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-stats')
  getAdminStats() {
    return { message: 'Data seluruh transaksi merchant' };
  }
}