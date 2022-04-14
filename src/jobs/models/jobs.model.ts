import { Document } from 'mongoose';

export interface Job extends Document {
  _id: string;
  title: string;
  daily_hours: number;
  total_hours: number;
  created_by: string;
  budget: number;
}
