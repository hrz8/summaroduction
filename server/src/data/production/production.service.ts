import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { DocumentType } from '@typegoose/typegoose';
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { ProdPlannedActivity, Production, ProdUnplannedActivity } from './production.model';

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

  public async removePlannedActivity(id: string, plannedActivityId: string): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $pull: { plannedActivities: { activity: plannedActivityId } } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async addUnplannedActivity(id: string, item: ProdUnplannedActivity): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $push: { unplannedActivities: item } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async removeUnplannedActivity(id: string, activityId: string): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $pull: { unplannedActivities: { _id: activityId } } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }
}
