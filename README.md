new update fitur saving-goal 
DATABASE_URL="postgresql://postgres.yekeegttsbbzwbkrvzyj:FintrackAdmin$@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.yekeegttsbbzwbkrvzyj:FintrackAdmin$@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="FintrackSecretKey123"
GOLD_API_KEY= goldapi-43cb251851700858d56f036b990e3a80-io
SUPABASE_URL=https://yekeegttsbbzwbkrvzyj.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlla2VlZ3R0c2Jiendia3J2enlqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzI3MTU1MSwiZXhwIjoyMDkyODQ3NTUxfQ.2rBkUNFu9xwSO4VgJtV3Nhm4ZTfvkua5lhHBoptM6j4

    // prisma/schema.prisma


  generator client {
    provider = "prisma-client-js"
  }
  datasource db {
    provider = "postgresql" 
    url       = env("DATABASE_URL")
    directUrl = env("DIRECT_URL")
  }

  enum Role {
    USER
    ADMIN
  }

 model User {
  id           String        @id @default(uuid())
  email        String        @unique
  password     String
  name         String?
  role         Role          @default(USER)
  balance      Float         @default(0)
  avatarUrl    String?       
  
  transactions Transaction[]
  savingsGoals SavingGoal[] 
  recurrents   RecurrentTransaction[] 
  
  createdAt    DateTime      @default(now())
  @@map("users")
}

model Transaction {
  id            String   @id @default(uuid())
  amount        Float
  type          String   
  description   String?
  userId        String
  categoryId    String
  balanceBefore Float
  balanceAfter  Float
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id])
  category      Category @relation(fields: [categoryId], references: [id])
}

model Category {
  id           String        @id @default(uuid())
  name         String        @unique
  transactions Transaction[]
}


model SavingGoal {
  id            String    @id @default(uuid())
  name          String   
  targetAmount  Float     
  currentAmount Float     @default(0) 
  category      String    @default("Lainnya") 
  
  deadline      DateTime? 
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  userId        String
  user          User      @relation(fields: [userId], references: [id])

  @@index([userId])
}

model RecurrentTransaction {
  id          String    @id @default(uuid())
  userId      String
  amount      Float
  type        TransactionType 
  category    String
  description String?
  frequency   String    
  startDate   DateTime  @default(now())
  nextRunDate DateTime
  isActive    Boolean   @default(true)

  user        User      @relation(fields: [userId], references: [id])
}

enum TransactionType {
  INCOME
  EXPENSE
}
