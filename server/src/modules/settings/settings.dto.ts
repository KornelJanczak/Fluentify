import { IsString, MinLength, IsNotEmpty } from 'class-validator';
import { ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

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
  tutorId?: string;

  @Transform(({ value }: { value: string[] | [] }) => {
    console.log('value', value);

    const newObj = {
      autoCorrect: value.find((value) => value === 'autoCorrect') || null,
      autoRecord: value.find((value) => value === 'autoRecord') || null,
      autoSend: value.find((value) => value === 'autoSend') || null,
    };

    console.log('newObj', newObj);

    return newObj;
  })
  chatSettings: {
    autoCorrect: boolean | null;
    autoRecord: boolean | null;
    autoSend: boolean | null;
  };
}
