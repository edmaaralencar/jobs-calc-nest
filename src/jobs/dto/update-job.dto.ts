import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateJobDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  daily_hours: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  total_hours: number;
}
