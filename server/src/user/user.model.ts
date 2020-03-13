import { prop } from '@typegoose/typegoose';
import { IsString, IsEmail } from 'class-validator';
import { BaseModel } from '../shared/base.model';

export class UserSafe extends BaseModel {
  @IsString()
  @prop({ required: true })
  public firstName!: string;

  @IsString()
  @prop()
  public lastName?: string;

  @prop({ unique: true, minlength: 6 })
  public username!: string;

  @IsEmail()
  @prop()
  public email?: string;

  @prop({ required: true })
  public role?: string;
}

export class User extends UserSafe {
  @prop({ required: true })
  public password!: string;
}
