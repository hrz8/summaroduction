import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ModelTypeService } from './modelType.service';
import { ModelType } from './modelType.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('model-type')
export class ModelTypeController extends BaseController<ModelType> {
  constructor(private readonly groupService: ModelTypeService) {
    super(groupService);
  }
}
