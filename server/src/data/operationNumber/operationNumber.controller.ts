import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { OperationNumberService } from './operationNumber.service';
import { OperationNumber } from './operationNumber.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('operation-number')
export class OperationNumberController extends BaseController<OperationNumber> {
  constructor(private readonly operationNumberService: OperationNumberService) {
    super(operationNumberService);
  }
}
