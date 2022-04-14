import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/models/users.model';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './models/jobs.model';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel('Jobs')
    private readonly jobsModel: Model<Job>,

    @InjectModel('User')
    private readonly usersModel: Model<User>,
  ) {}

  public async findAll(req: any): Promise<Job[]> {
    return this.jobsModel.find({ created_by: req.user.userId });
  }

  public async findOne(req: any): Promise<Job> {
    return this.jobsModel.findOne({
      _id: req.params.id,
      created_by: req.user.userId,
    });
  }

  public async create(req: any, createJobDto: CreateJobDto): Promise<Job> {
    const user = await this.usersModel.findById({ _id: req.user.userId });

    const job = new this.jobsModel({
      ...createJobDto,
      created_by: req.user.userId,
      budget: Number(user.value_hour) * Number(createJobDto.total_hours),
    });
    return job.save();
  }

  public async delete(req: any): Promise<{ msg: string }> {
    const { id: jobId } = req.params;
    const userId = String(req.user.userId);

    const job = await this.jobsModel.findOne({ _id: jobId });

    if (!job) {
      throw new NotFoundException('Job not found!');
    }

    if (userId === job.created_by.toString()) {
      await job.remove();

      return { msg: 'Job deleted successfully' };
    }

    throw new UnauthorizedException("You're not authorized to delete this job");
  }

  public async update(req: any, updateJobDto: UpdateJobDto) {
    const { title, daily_hours, total_hours } = updateJobDto;
    const { id: jobId } = req.params;
    const userId = String(req.user.userId);

    const job = await this.jobsModel.findOne({ _id: jobId });
    const user = await this.usersModel.findOne({ _id: req.user.userId });

    if (!job) {
      throw new NotFoundException('No job found with this id');
    }

    if (userId === job.created_by.toString()) {
      const updatedJob = await this.jobsModel.findOneAndUpdate(
        { _id: jobId },
        {
          title,
          daily_hours,
          total_hours,
          budget: user.value_hour * total_hours,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      return updatedJob;
    }

    throw new UnauthorizedException("You're not authorized to update this job");
  }

  private remainingDays(job) {
    const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();
    const createDate = new Date(job.created_at);
    const dueDay = createDate.getDate() + Number(remainingDays);
    const dueDateInMs = createDate.setDate(dueDay);

    const timeDiffInMs = dueDateInMs - Date.now();

    const dayInMs = 86400000;
    const dayDiff = Math.ceil(timeDiffInMs / dayInMs);

    return dayDiff;
  }

  public async info(req: any) {
    const jobs = await this.jobsModel.find({ created_by: req.user.userId });
    const user = await this.usersModel.findOne({ _id: req.user.userId });

    const statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    jobs.map((job) => {
      const remainingDays = this.remainingDays(job);

      const status = remainingDays <= 0 ? 'done' : 'progress';

      statusCount[status] += 1;

      status === 'progress'
        ? (jobTotalHours += Number(job.daily_hours))
        : jobTotalHours;
    });

    const freeHours = user.hours_per_day - jobTotalHours;

    return { statusCount, freeHours };
  }
}
