import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import UserRepository from 'src/shared/repositories/user.repository';
import { DbModule } from 'src/shared/db/db.module';
import { SessionSerializerService } from './session-serializer.service';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionSerializerService,
    GoogleStrategy,
    UserRepository,
  ],
})
export class AuthModule {}
