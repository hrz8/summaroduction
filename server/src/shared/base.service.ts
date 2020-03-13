import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoError } from 'mongodb';
import { DocumentQuery, Types } from 'mongoose';
import { BaseModel } from './base.model';
import { BasicFilterMessage } from './base.message';

type QueryList<T extends BaseModel> = DocumentQuery<
  Array<DocumentType<T>>,
  DocumentType<T>
>;
type QueryItem<T extends BaseModel> = DocumentQuery<
  DocumentType<T>,
  DocumentType<T>
>;

export abstract class BaseService<T extends BaseModel> {
  protected model: ReturnModelType<AnyParamConstructor<T>>;

  protected constructor(model: ReturnModelType<AnyParamConstructor<T>>)
  {
    this.model = model;
  }

  protected static throwMongoError(err: MongoError): void
  {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  protected static toObjectId(id: string): Types.ObjectId
  {
    try {
      return Types.ObjectId(id);
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async findAsync(message?: BasicFilterMessage<T>): Promise<Array<DocumentType<T>>>
  {
    try {
      return await this.model
        .find(message.filter)
        .sort(message.sort)
        .skip(message.offset)
        .limit(message.limit)
        .populate(message.populate)
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async findOneAsync(message?: BasicFilterMessage<T>): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .findOne(message.filter)
        .populate(message.populate)
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async findByIdAsync(id: string, populate: string = ''): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .findById(BaseService.toObjectId(id))
        .populate(populate)
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async createAsync(item: T): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .create(item);
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async updateAsync(item: T): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .findByIdAndUpdate(BaseService.toObjectId(item.id), item, { new: true })
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async deleteAsync(filter = {}): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .findOneAndDelete(filter)
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async deleteByIdAsync(id: string): Promise<DocumentType<T>>
  {
    try {
      return await this.model
        .findByIdAndDelete(BaseService.toObjectId(id))
        .exec();
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }

  public async countAsync(filter = {}): Promise<number>
  {
    try {
      return await this.model.count(filter);
    }
    catch(e) {
      BaseService.throwMongoError(e);
    }
  }
}
