import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobsSchema } from './schema/jobs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Jobs',
        schema: JobsSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
