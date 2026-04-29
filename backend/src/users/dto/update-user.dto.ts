import { IsEmail, IsString, IsNumber, Min, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: 'Format email tidak valid' })
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password baru minimal 6 karakter' })
  password?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Saldo tidak boleh negatif' })
  balance?: number; // Sesuai permintaanmu, user boleh update balance sendiri
}