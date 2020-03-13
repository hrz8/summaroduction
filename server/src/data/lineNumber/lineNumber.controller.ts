import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { LineNumberService } from './lineNumber.service';
import { LineNumber } from './lineNumber.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('line-number')
export class LineNumberController extends BaseController<LineNumber> {
  constructor(private readonly lineNumberService: LineNumberService) {
    super(lineNumberService);
  }
}
