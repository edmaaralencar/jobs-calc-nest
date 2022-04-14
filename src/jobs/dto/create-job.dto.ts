import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  daily_hours: number;

  @IsNotEmpty()
  @IsNumber()
  total_hours: number;
}
