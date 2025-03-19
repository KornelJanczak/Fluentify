import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import configuration from './common/config/configuration';
import { DbModule } from './shared/db/db.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from './shared/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { VocabularySetModule } from './modules/vocabulary-set/vocabulary-set.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
    DbModule,
    AuthModule,
    VocabularySetModule,
    RedisModule,
    ChatModule,
  ],
  providers: [AppService],
})
export class AppModule {}
