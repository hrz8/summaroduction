import { prop } from '@typegoose/typegoose';
import { IsString } from 'class-validator';

export abstract class BaseModel {
  public createdAt?: any;

  public updatedAt?: any; 
  public id?: string;

  public static get schema(): any {
    return {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: (doc, ret, options) => {
          delete ret._id;
          return ret;
      }
      },
    };
  }

  public static get modelName(): string {
    return this.name;
  }
}

export abstract class BaseModelString extends BaseModel {
  @IsString()
  @prop({ required: true })
  public name!: string;
  
  @IsString()
  @prop({ default: "" })

  public description?: string;
}