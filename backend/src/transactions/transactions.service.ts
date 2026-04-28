// src/transactions/transactions.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Catat transaksi baru
      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
        },
      });

      // 2. Hitung penyesuaian saldo
      const amountAdjustment = data.type === 'INCOME' ? data.amount : -data.amount;

      // 3. Update saldo user
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { increment: amountAdjustment },
        },
      });

      return transaction;
    });
  }
}