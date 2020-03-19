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

  public async removePlannedActivity(id: string, prodPlannedActivityId: string): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $pull: { plannedActivities: { _id: prodPlannedActivityId } } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async updatePlannedActivity(id: string, plannedActivityId: string, message: ProdPlannedActivity): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .updateOne({_id: id, 'plannedActivities._id': plannedActivityId }, 
          { 
            $set: { 
              'plannedActivities.$.minute': message.minute, 
              'plannedActivities.$.activity': message.activity
            }
          }
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

  public async removeUnplannedActivity(id: string, prodUnplannedActivityId: string): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .findByIdAndUpdate(BaseService.toObjectId(id), 
          { $pull: { unplannedActivities: { _id: prodUnplannedActivityId } } },
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async updateUnplannedActivity(id: string, prodUnplannedActivityId: string, message: ProdUnplannedActivity): Promise<DocumentType<Production>>
  {
    try {
      return await this.productionModel
        .updateOne({_id: id, 'unplannedActivities._id': prodUnplannedActivityId }, 
          { 
            $set: { 
              'unplannedActivities.$.minute': message.minute, 
              'unplannedActivities.$.activity': message.activity,
              'unplannedActivities.$.operationNumber': message.operationNumber,
              'unplannedActivities.$.description': message.description
            }
          }
        );
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }
}
