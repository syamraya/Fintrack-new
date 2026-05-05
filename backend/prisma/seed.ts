import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@fintrack.com' },
    update: {}, // Jangan ubah apa pun jika email sudah terdaftar
    create: {
      email: 'admin@gmail.com',
      name: 'Super Admin FinTrack',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 0,
    },
  });

  console.log('✅ Seed berhasil: Akun Admin siap digunakan.');
  console.log('📧 Email: admin@fintrack.com | 🔑 Pass: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed gagal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });