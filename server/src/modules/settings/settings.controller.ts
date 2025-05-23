import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingsDto, UpdateSettingsDto } from './settings.dto';
import { Settings } from 'src/shared/db/db.schema';
import { GoogleAuthGuard } from '../auth/strategies/google.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';

@UseGuards(GoogleAuthGuard)
@Controller('settings')
export class SettingsController {
  private readonly logger = new Logger(SettingsController.name);

  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  public async create(
    @Body() createSettingsDto: CreateSettingsDto,
    @UserId() userId: string,
  ): Promise<Settings> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const newSetting = await this.settingsService.create(
      createSettingsDto,
      userId,
    );

    this.logger.log(`Created new setting with ID: ${newSetting.id}`);

    return newSetting;
  }

  @Get('user')
  public async findByUserId(@UserId() userId: string): Promise<Settings> {
    const setting = await this.settingsService.findByUserId(userId);

    this.logger.log(`Fetched settings for user ID: ${userId}`);

    return setting;
  }

  @Get(':id')
  public async findById(@Param('id') id: string): Promise<Settings> {
    const setting = await this.settingsService.findById(id);

    this.logger.log(`Fetched setting with ID: ${id}`);

    return setting;
  }

  @Put('update')
  public async update(
    @UserId() userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<string> {
    console.log('updateSettingsDto', updateSettingsDto);

    const updatedSettingId = await this.settingsService.update(
      userId,
      updateSettingsDto,
    );

    this.logger.log(`Updated settings for user: ${userId}`);

    return updatedSettingId;
  }
}
