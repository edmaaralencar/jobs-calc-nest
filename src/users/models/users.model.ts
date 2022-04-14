import { Document } from 'mongoose';

export interface User extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  monthly_income: number;
  hours_per_day: number;
  days_per_week: number;
  vacation_per_year: number;
  value_hour: number;
  avatar_img: string;
}
