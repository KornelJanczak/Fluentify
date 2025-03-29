import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ValidateIf } from 'class-validator';

export class CreateSettingsDto {
  @IsNotEmpty({ message: 'Learning language is required!' })
  @IsString({ message: 'Learning language must be a string!' })
  @MinLength(2, {
    message: 'Learning language must be at least 2 characters long!',
  })
  learningLanguage: string;

  @IsNotEmpty({ message: 'Native language is required!' })
  @IsString({ message: 'Native language must be a string!' })
  @MinLength(2, {
    message: 'Native language must be at least 2 characters long!',
  })
  nativeLanguage: string;

  @IsNotEmpty({ message: 'Learning language is required!' })
  @IsString({ message: 'Learning language level must be a string!' })
  @MinLength(2, {
    message: 'Learning language level must be at least 2 characters long!',
  })
  learningLanguageLevel: string;

  tutorId?: string;

  autoCorrect?: boolean;

  autoRecord?: boolean;

  autoSend?: boolean;
}

export class UpdateSettingsDto extends PartialType(CreateSettingsDto) {
  @ValidateIf((o) => !o.learningLanguage || o.nativeLanguage)
  learningLanguage?: string;

  @ValidateIf((o) => !o.nativeLanguage || o.learningLanguage)
  nativeLanguage?: string;

  @ValidateIf((o) => !o.learningLanguageLevel || o.tutorId)
  learningLanguageLevel?: string;

  @ValidateIf((o) => !o.tutorId || o.learningLanguageLevel)
  tutorId?: string;

  autoCorrect?: boolean;

  autoRecord?: boolean;

  autoSend?: boolean;
}
