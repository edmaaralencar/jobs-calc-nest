import * as mongoose from 'mongoose';

export const JobsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    daily_hours: {
      type: Number,
    },
    total_hours: {
      type: Number,
    },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    budget: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
