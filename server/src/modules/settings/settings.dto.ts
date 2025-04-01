import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class ChatSettingsDto {
  @IsOptional()
  @IsBoolean({ message: 'autoCorrect must be a boolean!' })
  autoCorrect: boolean;

  @IsOptional()
  @IsBoolean({ message: 'autoRecord must be a boolean!' })
  autoRecord: boolean;

  @IsOptional()
  @IsBoolean({ message: 'autoSend must be a boolean!' })
  autoSend: boolean;
}

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
export class UpdateSettingsDto {
  @ValidateIf((object) => object.tutorId !== undefined)
  @IsString({ message: 'Tutor ID must be a string!' })
  @IsOptional()
  tutorId?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return {
        autoCorrect: value.find((value) => value === 'autoCorrect') || null,
        autoRecord: value.find((value) => value === 'autoRecord') || null,
        autoSend: value.find((value) => value === 'autoSend') || null,
      };
    }
    return value; // return original value if not an array
  })
  @ValidateNested()
  @Type(() => ChatSettingsDto)
  chatSettings?: ChatSettingsDto;
}
