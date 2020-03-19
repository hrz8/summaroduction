import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { OperationNumberController } from './operationNumber.controller';
import { OperationNumber } from './operationNumber.model';
import { OperationNumberService } from './operationNumber.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: OperationNumber, schemaOptions: OperationNumber.schema },
    ]),
  ],
  providers: [OperationNumberService],
  controllers: [OperationNumberController],
})
export class OperationNumberModule {}
