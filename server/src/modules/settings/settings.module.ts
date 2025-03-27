import { Module } from '@nestjs/common';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import { SettingsRepository } from 'src/shared/repositories/settings.repository';
import { DbModule } from 'src/shared/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [SettingsController],
  providers: [SettingsService, SettingsRepository],
})
export class SettingsModule {}
