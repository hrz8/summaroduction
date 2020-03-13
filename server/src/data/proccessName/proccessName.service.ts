import { Injectable } from '@nestjs/common';
import { InjectModel } from "nestjs-typegoose";
import { ReturnModelType } from '@typegoose/typegoose/lib/types';
import { BaseService } from '../../shared/base.service';
import { ProccessName } from './proccessName.model';

@Injectable()
export class ProccessNameService extends BaseService<ProccessName> {
  constructor(
    @InjectModel(ProccessName)
    private readonly proccessNameModel: ReturnModelType<typeof ProccessName>,
  ) {
    super(proccessNameModel);
  }
}
