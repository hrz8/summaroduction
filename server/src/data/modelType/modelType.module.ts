import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ModelTypeController } from './modelType.controller';
import { ModelType } from './modelType.model';
import { ModelTypeService } from './modelType.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: ModelType, schemaOptions: ModelType.schema },
    ]),
  ],
  providers: [ModelTypeService],
  controllers: [ModelTypeController],
})
export class ModelTypeModule {}
