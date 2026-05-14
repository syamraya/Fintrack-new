import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FilesService } from '../files/files.service'; // Pastikan path-nya benar
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private filesService: FilesService, 
  ) {}

async updateAvatar(userId: string, avatarUrl: string) { 
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { avatarUrl }, 
        select: { 
          id: true, 
          name: true, 
          email: true, 
          avatarUrl: true 
        },
      });
      return {
        message: 'Foto profil berhasil diupdate!',
        data: updatedUser,
      };
    } catch (error: any) {
      this.logger.error(`Gagal update database user ${userId}: ${error.message}`);
      
      if (error.code === 'P2025') {
        throw new NotFoundException('User tidak ditemukan di database.');
      }

      throw new InternalServerErrorException('Gagal menyimpan URL foto ke database.');
    }
  }
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User tidak ditemukan');
    
    const { password, ...result } = user;
    return result;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, email: true, balance: true, avatarUrl: true }
    });
  }

  async updateRole(id: string, newRole: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User target tidak ada, bre!');

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true }
    });
  }
}