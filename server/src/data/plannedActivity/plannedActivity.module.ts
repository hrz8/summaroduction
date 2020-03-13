import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { PlannedActivityController } from './plannedActivity.controller';
import { PlannedActivity } from './plannedActivity.model';
import { PlannedActivityService } from './plannedActivity.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: PlannedActivity, schemaOptions: PlannedActivity.schema },
    ]),
  ],
  providers: [PlannedActivityService],
  controllers: [PlannedActivityController],
})
export class PlannedActivityModule {}
