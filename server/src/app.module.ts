import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShiftModule } from './data/shift/shift.module';
import { GroupModule } from './data/group/group.module';
import { ProccessNameModule } from './data/proccessName/proccessName.module';
import { LineNumberModule } from './data/lineNumber/lineNumber.module';
import { ModelTypeModule } from './data/modelType/modelType.module';
import { PlannedActivityModule } from './data/plannedActivity/plannedActivity.module';
import { UnplannedActivityModule } from './data/unplannedActivity/unplannedActivity.module';
import { ProductionModule } from './data/production/production.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://127.0.0.1/summaroduction', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }),
    AuthModule,
    UserModule,
    // base model string
    ShiftModule,
    GroupModule,
    ProccessNameModule,
    LineNumberModule,
    ModelTypeModule,
    PlannedActivityModule,
    UnplannedActivityModule,
    ProductionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
