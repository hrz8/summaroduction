import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { LineNumber } from './lineNumber.model';

@Injectable()
export class LineNumberService extends BaseService<LineNumber> {
  constructor(
    @InjectModel(LineNumber)
    private readonly lineNumberModel: ReturnModelType<typeof LineNumber>,
  ) {
    super(lineNumberModel);
  }
}
