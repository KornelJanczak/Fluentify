// filepath: /c:/Users/korne/Desktop/Fluentify-server/src/modules/vocabulary-set/vocabulary-set.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Logger,
  Query,
  UseGuards,
} from '@nestjs/common';
import { VocabularySetService } from './vocabulary-set.service';
import {
  CreateVocabularySetDto,
  FindAllByUserIdResponseDto,
  FindOneByIdResponseDto,
  UpdateVocabularySetDto,
} from './vocabulary-set.dto';
import { GoogleAuthGuard } from '../auth/strategies/google.guard';
import { UserId } from 'src/common/decorators/user-id.decorator';

@Controller('vocabulary-set')
@UseGuards(GoogleAuthGuard)
export class VocabularySetController {
  public readonly logger: Logger = new Logger(VocabularySetController.name);

  constructor(public vocabularySetService: VocabularySetService) {}

  @Post()
  public async create(
    @Body() createVocabularySetDto: CreateVocabularySetDto,
    @UserId() userId: string,
  ): Promise<{ createdVocabularySetId: string }> {
    const createdVocabularySetId = await this.vocabularySetService.create(
      createVocabularySetDto,
      userId,
    );

    this.logger.log(
      `Created vocabulary set with ID: ${createdVocabularySetId} for user: ${userId}`,
    );

    return { createdVocabularySetId };
  }

  @Get(':page')
  public async findAllByUserId(
    @UserId() userId: string,
    @Param('page') page: string,
    @Query('searchInput') searchInput?: string,
  ): Promise<FindAllByUserIdResponseDto> {
    const vocabularySets = await this.vocabularySetService.findAllByUserId(
      userId,
      page,
      searchInput,
    );

    this.logger.log(`Found vocabulary sets for user ID: ${userId}`);

    return vocabularySets;
  }

  @Get('/details/:id')
  public async findOneById(
    @Param('id') id: string,
  ): Promise<FindOneByIdResponseDto> {
    const vocabularySet = await this.vocabularySetService.findOneById(id);

    this.logger.log(`Found vocabulary set with ID: ${id}`);

    return vocabularySet;
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateVocabularySetDto: UpdateVocabularySetDto,
  ): Promise<{ vocabularySetId: string }> {
    const vocabularySetId = await this.vocabularySetService.update(
      id,
      updateVocabularySetDto,
    );

    this.logger.log(`Updated vocabulary set with ID: ${vocabularySetId}`);

    return { vocabularySetId };
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
  ): Promise<{ deletedVocabularySetId: string }> {
    const deletedVocabularySetId = await this.vocabularySetService.delete(id);

    this.logger.log(
      `Deleted vocabulary set with ID: ${deletedVocabularySetId}`,
    );

    return { deletedVocabularySetId };
  }
}
