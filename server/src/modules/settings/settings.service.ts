import { Injectable } from '@nestjs/common';
import { SettingsRepository } from 'src/shared/repositories/settings.repository';
import { Settings } from 'src/shared/db/db.schema';
import { ServiceError } from 'src/common/service-error';
import { CreateSettingsDto, UpdateSettingsDto } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(private settingsRepository: SettingsRepository) {}

  public async create(
    createSettingsDto: CreateSettingsDto,
    userId: string,
  ): Promise<Settings> {
    const newSetting = await this.settingsRepository.create(
      createSettingsDto,
      userId,
    );

    if (!newSetting)
      throw ServiceError.NotFoundError('Failed to create settings');

    return newSetting;
  }

  public async findById(id: string): Promise<Settings> {
    const setting = await this.settingsRepository.findById(id);

    if (!setting)
      throw ServiceError.NotFoundError(`Settings with id ${id} not found`);

    return setting;
  }

  public async findByUserId(userId: string): Promise<Settings> {
    const setting = await this.settingsRepository.findByUserId(userId);

    if (!setting) throw ServiceError.NotFoundError(`User settings not found`);

    return setting;
  }

  public async update(
    userId: string,
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<string> {
    const updatedSettingId = await this.settingsRepository.updateByUserId(
      userId,
      updateSettingsDto,
    );

    if (!updatedSettingId)
      throw ServiceError.NotFoundError('Failed to update settings');

    return updatedSettingId;
  }
}
