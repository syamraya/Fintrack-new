import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto'; // Sesuaikan path-nya
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async register(dto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          password: hashedPassword,
          balance: 0, 
        },
      });
      const { password, ...result } = user;
      return {
        message: 'Registrasi berhasil, bre!',
        data: result,
      };
      
    } catch (error: any) { 
  if (error.code === 'P2002') {
    throw new ConflictException('Email ini sudah terdaftar, pakai yang lain!');
  }
  throw new InternalServerErrorException('Ada masalah di server, bre!');
}
  }
}