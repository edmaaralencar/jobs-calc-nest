import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsNumber()
  @IsNotEmpty()
  monthly_income: number;

  @IsNumber()
  @IsNotEmpty()
  hours_per_day: number;

  @IsNumber()
  @IsNotEmpty()
  days_per_week: number;

  @IsNumber()
  @IsNotEmpty()
  vacation_per_year: number;

  @IsString()
  @IsOptional()
  avatar_img: string;
}
