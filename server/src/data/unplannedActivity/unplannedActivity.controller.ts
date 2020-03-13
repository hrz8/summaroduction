import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { UnplannedActivityService } from './unplannedActivity.service';
import { UnplannedActivity } from './unplannedActivity.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('group')
export class UnplannedActivityController extends BaseController<UnplannedActivity> {
  constructor(private readonly unplannedActivityService: UnplannedActivityService) {
    super(unplannedActivityService);
  }
}
