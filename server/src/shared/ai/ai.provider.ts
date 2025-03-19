import { createOpenAI } from '@ai-sdk/openai';
import { ConfigService } from '@nestjs/config';

export const AiProvider = 'AiProvider';

export const aiProvider = [
  {
    provide: AiProvider,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      return createOpenAI({
        apiKey: configService.get<string>('OPENAI_API_KEY'),
        compatibility: 'strict',
      });
    },
  },
];
