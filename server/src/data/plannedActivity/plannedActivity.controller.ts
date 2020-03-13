import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { PlannedActivityService } from './plannedActivity.service';
import { PlannedActivity } from './plannedActivity.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('planned-activity')
export class PlannedActivityController extends BaseController<PlannedActivity> {
  constructor(private readonly plannedActivityService: PlannedActivityService) {
    super(plannedActivityService);
  }
}
