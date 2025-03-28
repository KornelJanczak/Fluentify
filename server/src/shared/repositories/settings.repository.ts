import { eq } from 'drizzle-orm';
import { type Settings, settings } from '../db/db.schema';
import { ServiceError } from 'src/common/service-error';
import { Inject, Injectable } from '@nestjs/common';
import { Drizzle, DrizzleAsyncProvider } from '../db/db.provider';
import { CreateSettingsDto } from 'src/modules/settings/settings.dto';

@Injectable()
export class SettingsRepository {
  constructor(@Inject(DrizzleAsyncProvider) private db: Drizzle) {}

  public async create(newSetting: CreateSettingsDto): Promise<Settings> {
    try {
      const [createdSetting] = await this.db
        .insert(settings)
        .values(newSetting)
        .returning();

      return createdSetting;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findById(id: string): Promise<Settings> {
    try {
      const [setting] = await this.db
        .select()
        .from(settings)
        .where(eq(settings.id, id));

      return setting;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async findByUserId(userId: string): Promise<Settings> {
    try {
      const [setting] = await this.db
        .select()
        .from(settings)
        .where(eq(settings.userId, userId));

      return setting;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }

  public async update(
    id: string,
    updatedSetting: Partial<Settings>,
  ): Promise<string> {
    try {
      const [{ id: settingId }] = await this.db
        .update(settings)
        .set(updatedSetting)
        .where(eq(settings.id, id))
        .returning({ id: settings.id });

      return settingId;
    } catch (error) {
      throw ServiceError.DatabaseError(error.message, error.stack);
    }
  }
}
