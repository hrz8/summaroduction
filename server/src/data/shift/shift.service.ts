import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { Shift } from './shift.model';

@Injectable()
export class ShiftService extends BaseService<Shift> {
  constructor(
    @InjectModel(Shift)
    private readonly shiftModel: ReturnModelType<typeof Shift>,
  ) {
    super(shiftModel);
  }
}
