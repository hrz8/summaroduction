import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { ModelType } from './modelType.model';

@Injectable()
export class ModelTypeService extends BaseService<ModelType> {
  constructor(
    @InjectModel(ModelType)
    private readonly modelTypeModel: ReturnModelType<typeof ModelType>,
  ) {
    super(modelTypeModel);
  }
}
