import { BaseModelString } from '../../shared/base.model';
import { IsNumber } from 'class-validator';
import { prop } from '@typegoose/typegoose';
 
export class PlannedActivity extends BaseModelString {
  @IsNumber()
  @prop({ default: 0 })
  public minuteDefault?: number;
}
