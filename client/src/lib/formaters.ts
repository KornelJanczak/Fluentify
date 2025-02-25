import { CreateVocabularySetRequest } from "@/common/hooks/use-create-vocabulary-set";

export const formatCreateVocabularySetData = ({
  title,
  description,
  flashCards,
}: CreateVocabularySetRequest) => ({
  title,
  description,
  flashCards: flashCards
    .map(({ translation, definition }) =>
      translation !== "" && definition !== ""
        ? { translation, definition }
        : null
    )
    .filter(Boolean),
});

export const formatUpdateVocabularySetData = ({
  
})