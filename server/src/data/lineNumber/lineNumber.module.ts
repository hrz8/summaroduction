import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { LineNumberController } from './lineNumber.controller';
import { LineNumber } from './lineNumber.model';
import { LineNumberService } from './lineNumber.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: LineNumber, schemaOptions: LineNumber.schema },
    ]),
  ],
  providers: [LineNumberService],
  controllers: [LineNumberController],
})
export class ShiftModule {}
