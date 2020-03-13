import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { PlannedActivity } from './plannedActivity.model';

@Injectable()
export class PlannedActivityService extends BaseService<PlannedActivity> {
  constructor(
    @InjectModel(PlannedActivity)
    private readonly plannedActivityModel: ReturnModelType<typeof PlannedActivity>,
  ) {
    super(plannedActivityModel);
  }
}
