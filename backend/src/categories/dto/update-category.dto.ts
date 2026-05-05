import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType membuat semua field di CreateCategoryDto menjadi opsional
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}