import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProccessNameController } from './proccessName.controller';
import { ProccessName } from './proccessName.model';
import { ProccessNameService } from './proccessName.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: ProccessName, schemaOptions: ProccessName.schema },
    ]),
  ],
  providers: [ProccessNameService],
  controllers: [ProccessNameController],
})
export class ProccessNameModule {}
