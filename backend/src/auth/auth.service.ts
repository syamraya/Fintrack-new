import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto'; // Pastikan path benar
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    try {
      
      const hashedPassword = await bcrypt.hash(dto.password, 10); 
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          role: 'USER', 
        },
      });

      
      const { password, ...result } = user;
      return {
        message: 'Registrasi berhasil,Silakan login.',
        data: result,
      };

    } catch (error) {
      // Cek jika email sudah terdaftar (Unique Constraint Error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email ini sudah terdaftar');
        }
      }
      
      throw new InternalServerErrorException('Server lagi pusing, coba lagi nanti.');
    }
  }

  async login(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { email } 
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah, bre!');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email atau password salah, bre!');
    }

    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };

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