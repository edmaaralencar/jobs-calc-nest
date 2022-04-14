import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from './models/users.model';
import { AuthService } from '../auth/auth.service';
import { SignupDto } from './dto/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SigninDto } from './dto/signin.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signup(signupDto: SignupDto) {
    const user = new this.usersModel(signupDto);
    await user.save();
  }

  public async signin(signinDto: SigninDto): Promise<{
    jwtToken: string;
    user: { name: string; value_hour: number; avatar_img: string };
  }> {
    const createdUser = await this.findByEmail(signinDto.email);
    const match = await this.comparePasswords(signinDto.password, createdUser);

    if (!match) {
      throw new NotFoundException('Invalid credentials');
    }

    const jwtToken = await this.authService.createAccessToken(createdUser._id);

    const user = {
      name: createdUser.name,
      value_hour: createdUser.value_hour,
      avatar_img: createdUser.avatar_img,
    };

    return { user, jwtToken };
  }

  public async updateProfile(
    request: any,
    updateProfileDto: UpdateProfileDto,
  ): Promise<{ value_hour: number; avatar_img: string; name: string }> {
    const {
      days_per_week,
      hours_per_day,
      monthly_income,
      vacation_per_year,
      avatar_img,
    } = updateProfileDto;

    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - vacation_per_year) / 12;
    const weekTotalHours = hours_per_day * days_per_week;
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;
    const value_hour = monthly_income / monthlyTotalHours;

    const updatedProfile = await this.usersModel.findOneAndUpdate(
      { _id: request.user.userId },
      {
        value_hour,
        days_per_week,
        hours_per_day,
        monthly_income,
        vacation_per_year,
        avatar_img,
      },
      { new: true, runValidators: true },
    );

    return {
      value_hour,
      avatar_img,
      name: updatedProfile.name,
    };
  }

  private async findByEmail(email: string): Promise<User> {
    const user = await this.usersModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    return user;
  }

  private async comparePasswords(
    password: string,
    user: User,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new NotFoundException('Invalid credentials');
    }

    return match;
  }
}
