import {
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType } from '@nestjs/swagger';
import { CoreMessage } from 'ai';

class BaseChatDto {
  @IsUUID()
  id: string;

  @IsNumber()
  @IsOptional()
  usedTokens?: number;

  @IsString()
  category: string;

  @IsString()
  topic: string;

  @IsString()
  userId: string;

  @IsUUID()
  @IsOptional()
  vocabularySetId?: string;
}

class BaseMessageDto {
  @IsUUID()
  id: string;

  @IsString()
  content: unknown;

  @IsString()
  role: string;

  @IsNumber()
  @IsOptional()
  usedTokens?: number;

  @IsString()
  createdAt: Date;
}

export class StartChatDto {
  @IsString()
  chatId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() =>
    OmitType(BaseMessageDto, ['id', 'usedTokens', 'createdAt'] as const),
  )
  messages: CoreMessage[];
}

export class CreateChatDto extends OmitType(BaseChatDto, [
  'id',
  'userId',
] as const) {}

export class FindWithMessagesByIdResponseDto extends BaseChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BaseMessageDto)
  messages: BaseMessageDto[];
}

export class FindAllByUserIdResponseDto extends BaseChatDto {}

export class FindOneByIdResponseDto extends BaseChatDto {}
