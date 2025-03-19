// filepath: /c:/Users/korne/Desktop/Fluentify-server/src/modules/vocabulary-set/vocabulary-set.service.ts
import { Injectable } from '@nestjs/common';
import {
  FindOneByIdResponseDto,
  CreateVocabularySetDto,
  FindAllByUserIdResponseDto,
  UpdateVocabularySetDto,
} from './vocabulary-set.dto';
import VocabularySetRepository from 'src/shared/repositories/vocabulary-set.repository';
import { ServiceError } from 'src/common/service-error';

@Injectable()
export class VocabularySetService {
  constructor(private vocabularySetRepository: VocabularySetRepository) {}

  public async create(
    createVocabularySetDto: CreateVocabularySetDto,
    userId: string,
  ): Promise<string> {
    const vocabularySetId = await this.vocabularySetRepository.create(
      { ...createVocabularySetDto, userId },
      createVocabularySetDto.flashCards.map((flashCard) => ({
        ...flashCard,
        userId,
      })),
    );

    if (!vocabularySetId)
      throw ServiceError.NotFoundError('Failed to create vocabulary set');

    return vocabularySetId;
  }

  public async findAllByUserId(
    userId: string,
    page?: string,
    searchInput?: string,
  ): Promise<FindAllByUserIdResponseDto> {
    const itemsPerPage = 5;

    const vocabularySets = await this.vocabularySetRepository.findAllByUserId(
      userId,
      page,
      searchInput,
    );

    if (!vocabularySets)
      throw ServiceError.NotFoundError(`Not found user with id: ${userId}`);

    const hasMore = vocabularySets.length > itemsPerPage;

    const paginatedResults = hasMore
      ? vocabularySets.slice(0, itemsPerPage)
      : vocabularySets;

    return { vocabularySets: paginatedResults, hasMore };
  }

  public async findOneById(id: string): Promise<FindOneByIdResponseDto> {
    const vocabularySet = await this.vocabularySetRepository.findOneById(id);

    if (!vocabularySet)
      throw ServiceError.NotFoundError(
        `Not found vocabulary set with id: ${id}`,
      );

    return vocabularySet;
  }

  public async update(
    id: string,
    vocabularySet: UpdateVocabularySetDto,
  ): Promise<string> {
    const updatedVocabularySetId = await this.vocabularySetRepository.update(
      id,
      vocabularySet,
    );

    if (!updatedVocabularySetId)
      throw ServiceError.NotFoundError('Failed to update vocabulary set');

    return updatedVocabularySetId;
  }

  public async delete(id: string): Promise<string> {
    return await this.vocabularySetRepository.deleteById(id);
  }
}
