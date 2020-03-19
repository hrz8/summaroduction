import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { OperationNumber } from './operationNumber.model';

@Injectable()
export class OperationNumberService extends BaseService<OperationNumber> {
  constructor(
    @InjectModel(OperationNumber)
    private readonly operationNumberModel: ReturnModelType<typeof OperationNumber>,
  ) {
    super(operationNumberModel);
  }
}
