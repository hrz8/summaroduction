import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { GroupController } from './group.controller';
import { Group } from './group.model';
import { GroupService } from './group.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Group, schemaOptions: Group.schema },
    ]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
