import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { Production } from './production.model';

@Injectable()
export class ProductionService extends BaseService<Production> {
  constructor(
    @InjectModel(Production)
    private readonly productionModel: ReturnModelType<typeof Production>,
  ) {
    super(productionModel);
  }
}
