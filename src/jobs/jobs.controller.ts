import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
@UseGuards(AuthGuard('jwt'))
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(@Req() req: any) {
    return this.jobsService.findAll(req);
  }

  @Get('info')
  @HttpCode(HttpStatus.OK)
  public async info(@Req() req: any) {
    return this.jobsService.info(req);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findOne(@Req() req: any) {
    return this.jobsService.findOne(req);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Req() req: any, @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(req, createJobDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  public async delete(@Req() req: any) {
    return this.jobsService.delete(req);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Req() req: any, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(req, updateJobDto);
  }
}
