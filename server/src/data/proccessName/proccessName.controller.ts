import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ProccessNameService } from './proccessName.service';
import { ProccessName } from './proccessName.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('proccess-name')
export class ProccessNameController extends BaseController<ProccessName> {
  constructor(private readonly proccessNameService: ProccessNameService) {
    super(proccessNameService);
  }
}
