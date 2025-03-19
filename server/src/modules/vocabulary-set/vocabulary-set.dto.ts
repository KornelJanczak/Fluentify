import { IsString, MinLength, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { FlashCard } from 'src/shared/db/db.schema';
import { type VocabularySetWithFlashCardsCount } from 'src/shared/repositories/vocabulary-set.repository';

class CreateFlashCardDto {
  @IsString()
  translation: string;

  @IsString()
  @MinLength(2)
  definition: string;
}

class UpdateFlashCardDto {
  @IsString()
  @MinLength(2)
  id: string;

  @IsString()
  @MinLength(2)
  translation: string;

  @IsString()
  @MinLength(2)
  definition: string;
}

export class CreateVocabularySetDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashCardDto)
  flashCards: CreateFlashCardDto[];
}

export class UpdateVocabularySetDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlashCardDto)
  flashCards: UpdateFlashCardDto[];
}

export class FindAllByUserIdResponseDto {
  @IsArray()
  vocabularySets: VocabularySetWithFlashCardsCount[];

  @IsString()
  hasMore: boolean;
}

export class FindOneByIdResponseDto {
  @IsString()
  id: string;

  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(2)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashCardDto)
  flashCards: Omit<FlashCard, 'vocabularySetId'>[];
}
