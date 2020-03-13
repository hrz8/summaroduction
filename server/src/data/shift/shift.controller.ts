import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ShiftService } from './shift.service';
import { Shift } from './shift.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('shift')
export class ShiftController extends BaseController<Shift> {
  constructor(private readonly shiftService: ShiftService) {
    super(shiftService);
  }
}
