import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ProductionService } from './production.service';
import { Production } from './production.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('production')
export class ProductionController extends BaseController<Production> {
  constructor(private readonly productionService: ProductionService) {
    super(productionService);
  }
}
