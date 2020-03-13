import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ShiftController } from './shift.controller';
import { Shift } from './shift.model';
import { ShiftService } from './shift.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Shift, schemaOptions: Shift.schema },
    ]),
  ],
  providers: [ShiftService],
  controllers: [ShiftController],
})
export class ShiftModule {}
