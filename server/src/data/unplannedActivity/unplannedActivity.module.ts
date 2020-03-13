import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UnplannedActivityController } from './unplannedActivity.controller';
import { UnplannedActivity } from './unplannedActivity.model';
import { UnplannedActivityService } from './unplannedActivity.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: UnplannedActivity, schemaOptions: UnplannedActivity.schema },
    ]),
  ],
  providers: [UnplannedActivityService],
  controllers: [UnplannedActivityController],
})
export class UnplannedActivityModule {}
