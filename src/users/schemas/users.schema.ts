import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar_img: {
    type: String,
    required: false,
    default: '',
  },
  monthly_income: {
    type: Number,
    required: false,
    default: 0,
  },
  hours_per_day: {
    type: Number,
    required: false,
    default: 0,
  },
  days_per_week: {
    type: Number,
    required: false,
    default: 0,
  },
  vacation_per_year: {
    type: Number,
    required: false,
    default: 0,
  },
  value_hour: {
    type: Number,
    required: false,
    default: 0,
  },
});

UsersSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    this['password'] = await bcrypt.hash(this['password'], 10);
  } catch (err) {
    return next(err);
  }
});
