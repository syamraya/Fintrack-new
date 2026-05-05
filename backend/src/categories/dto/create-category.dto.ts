import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  @MinLength(3, { message: 'Nama kategori minimal 3 karakter' })
  @MaxLength(20, { message: 'Nama kategori maksimal 20 karakter' })
  name: string;
}