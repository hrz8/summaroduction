import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductionController } from './production.controller';
import { Production } from './production.model';
import { ProductionService } from './production.service';

@Module({
  imports: [
    TypegooseModule.forFeature([
      { typegooseClass: Production, schemaOptions: Production.schema },
    ]),
  ],
  providers: [ProductionService],
  controllers: [ProductionController],
})
export class ProductionModule {}
