import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShiftModule } from './data/shift/shift.module';
import { GroupModule } from './data/group/group.module';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://127.0.0.1/summaroduction', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }),
    AuthModule,
    UserModule,
    ShiftModule,
    GroupModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
