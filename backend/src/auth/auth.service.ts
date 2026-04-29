import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../users/dto/login.dto'; // Import DTO login kamu
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  register(createUserDto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ... fungsi register kamu yang sebelumnya ...

  // TAMBAHKAN FUNGSI LOGIN INI:
  async login(email: string, pass: string) {
    // 1. Cari user berdasarkan email
    const user = await this.prisma.user.findUnique({ 
      where: { email } 
    });

    // 2. Jika user tidak ada, lempar error
    if (!user) {
      throw new UnauthorizedException('Email atau password salah, bre!');
    }

    // 3. Bandingkan password input dengan password di database (hash)
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah, bre!');
    }

    // 4. Jika cocok, buatkan Payload JWT
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

    // 5. Return token dan data user (tanpa password)
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        balance: user.balance
      }
    };
  }
}