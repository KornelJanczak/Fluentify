import { Module } from '@nestjs/common';
import { VocabularySetService } from './vocabulary-set.service';
import { VocabularySetRepository } from 'src/shared/repositories/vocabulary-set.repository';
import { DbModule } from 'src/shared/db/db.module';
import { VocabularySetController } from './vocabulary-set.controller';

@Module({
  imports: [DbModule],
  controllers: [VocabularySetController],
  providers: [VocabularySetService, VocabularySetRepository],
})
export class VocabularySetModule {}
