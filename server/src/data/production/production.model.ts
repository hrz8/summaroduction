import { prop, Ref, arrayProp } from '@typegoose/typegoose';
import { IsNumber, IsString } from 'class-validator';
import { BaseModel } from '../../shared/base.model';
import { Shift } from '../shift/shift.model';
import { Group } from '../group/group.model';
import { ProccessName } from '../proccessName/proccessName.model';
import { LineNumber } from '../lineNumber/lineNumber.model';
import { ModelType } from '../modelType/modelType.model';
import { PlannedActivity } from '../plannedActivity/plannedActivity.model';
import { UnplannedActivity } from '../unplannedActivity/unplannedActivity.model';
import { OperationNumber } from '../operationNumber/operationNumber.model';

export class ProdPlannedActivity {
  @IsNumber()
  @prop({ required: true })
  public minute!: number;

  @prop({ required: true, ref: PlannedActivity })
  public activity!: Ref<PlannedActivity>;
}

export class ProdUnplannedActivity {
  @IsNumber()
  @prop({ required: true })
  public minute!: number;

  @prop({ required: true, ref: UnplannedActivity })
  public activity!: Ref<UnplannedActivity>;

  @prop({ ref: OperationNumber })

  public operationNumber?: Ref<OperationNumber>;

  @IsString()
  @prop({ default: "" })

  public description?: string;
}

export class Production extends BaseModel {

  @IsString()
  @prop({ required: true, unique: true })
  public code!: string;

  @prop({ required: true, ref: Shift })
  public shift!: Ref<Shift>;

  @prop({ required: true, ref: Group })
  public group!: Ref<Group>;

  @prop({ required: true, ref: ProccessName })
  public proccessName!: Ref<ProccessName>;

  @prop({ required: true, ref: LineNumber })
  public lineNumber!: Ref<LineNumber>;

  @prop({ required: true, ref: ModelType })
  public modelType!: Ref<ModelType>;

  @IsNumber()
  @prop({ required: true })
  public targetAmount!: number;

  @IsNumber()
  @prop({ required: true })
  public actualAmount!: number;

  @IsNumber()
  @prop({ required: true })
  public okAmount!: number;

  @prop({ required: true })
  public startAt!: Date

  @prop({ required: true })
  public finishAt!: Date

  @IsString()
  @prop({ default: "" })

  public description?: string;

  @arrayProp({ items: ProdPlannedActivity })
  public plannedActivities?: Array<ProdPlannedActivity>;

  @arrayProp({ items: ProdUnplannedActivity })
  public unplannedActivities?: Array<ProdUnplannedActivity>;

}
