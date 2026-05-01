import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    console.log('Getting stats for userId:', userId);
    
    // Debug: lihat semua transaksi user
    const allTransactions = await this.prisma.transaction.findMany({
      where: { userId },
      select: { type: true, amount: true }
    });
    console.log('All transactions:', allTransactions);
    
    // Melakukan agregasi langsung di level database (lebih cepat)
    const aggregations = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: {
        amount: true,
      },
    });

    console.log('Aggregations:', aggregations);

    // Mapping hasil agregasi
    const stats = {
      totalRevenue: 0,
      totalExpenses: 0,
    };

    aggregations.forEach((item) => {
      if (item.type === 'INCOME') {
        stats.totalRevenue = item._sum.amount || 0;
      } else if (item.type === 'EXPENSE') {
        stats.totalExpenses = item._sum.amount || 0;
      }
    });

    return {
      ...stats,
      netProfit: stats.totalRevenue - stats.totalExpenses,
    };
  }

  async findAll(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc', 
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async create(userId: string, dto: CreateTransactionDto) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
      });

      if (!user) throw new BadRequestException('User tidak ditemukan');

      const balanceBefore = user.balance;
      if (dto.type === 'EXPENSE' && balanceBefore < dto.amount) {
        throw new BadRequestException('Saldo tidak cukup, bre!');
      }

      const adjustment = dto.type === 'INCOME' ? dto.amount : -dto.amount;
      const balanceAfter = balanceBefore + adjustment;

     
      await tx.user.update({
        where: { id: userId },
        data: { balance: balanceAfter },
      });

    
      const transaction = await tx.transaction.create({
        data: {
          ...dto,
          userId,
          balanceBefore,
          balanceAfter,
        },
      });

      return {
        message: `Transaksi ${dto.type} berhasil`,
        currentBalance: balanceAfter,
        data: transaction,
      };
    });
  }
}