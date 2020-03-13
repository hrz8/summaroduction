import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { UnplannedActivity } from './unplannedActivity.model';

@Injectable()
export class UnplannedActivityService extends BaseService<UnplannedActivity> {
  constructor(
    @InjectModel(UnplannedActivity)
    private readonly unplannedActivityModel: ReturnModelType<typeof UnplannedActivity>,
  ) {
    super(unplannedActivityModel);
  }
}
