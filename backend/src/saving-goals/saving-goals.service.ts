import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { AddDepositDto, CreateSavingGoalDto } from "./dto/create-saving-goal.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SavingGoalsService {
  constructor(private prisma: PrismaService) {}

async create(userId: string, dto: CreateSavingGoalDto) {
  try {
    return await this.prisma.savingGoal.create({
      data: {
        ...dto,
        userId,
      },
    });
  } catch (error) {
    // Cek apakah error ini berasal dari Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new UnauthorizedException('User tidak ditemukan di database, silakan login ulang!');
      }
    }
    throw error;
  }
}

async findAll(userId: string) {
  const goals = await this.prisma.savingGoal.findMany({
    where: { userId },
  });

  return goals.map(goal => ({
    ...goal,
    progress: goal.targetAmount > 0 
      ? Math.round((goal.currentAmount / goal.targetAmount) * 100) 
      : 0,
    isReached: goal.currentAmount >= goal.targetAmount
  }));
}
  
async deposit(userId: string, goalId: string, dto: AddDepositDto) {
  const { amount } = dto;
  const goal = await this.prisma.savingGoal.findFirst({
    where: { id: goalId, userId: userId }
  });

  if (!goal) throw new NotFoundException('Target tabungan tidak ditemukan!');
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (user.balance < amount) {
    throw new BadRequestException('Saldo kamu tidak cukup untuk menabung segini, bre!');
  }

  return this.prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { balance: { decrement: amount } }
    });
    const updatedGoal = await tx.savingGoal.update({
      where: { id: goalId },
      data: { currentAmount: { increment: amount } }
    });

    return {
      message: `Berhasil nabung Rp ${amount.toLocaleString()} buat ${goal.name}!`,
      currentBalance: user.balance - amount,
      goalDetails: updatedGoal
    };
  });
}
}