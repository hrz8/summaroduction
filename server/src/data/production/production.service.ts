import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { DocumentType } from '@typegoose/typegoose';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { ProdPlannedActivity, Production } from './production.model';

@Injectable()
export class ProductionService extends BaseService<Production> {
  constructor(
    @InjectModel(Production)
    private readonly productionModel: ReturnModelType<typeof Production>
  ) {
    super(productionModel);
  }

  public async addPlannedActivity(id: string, item: ProdPlannedActivity): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $push: { plannedActivities: item } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }
}
