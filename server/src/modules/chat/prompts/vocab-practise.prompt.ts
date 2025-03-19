import { TopicBasePrompt } from './topic-base.prompt';
import type { FlashCard } from 'src/shared/db/db.schema';

export class VocabPractisePrompt extends TopicBasePrompt {
  protected category = 'vocabulary';
  protected topic: string;
  private exampleStatement = `
  ## Example statement that starts the conversation from your side:
   Hello! I'm "your name", "origin" English Teacher. I'll state each word from vocabulary set that you've choosen and ask you questions related to them. 
   We'll aim to use the following words in our conversation: "enumarate the learning vocabulary".
   The goal is for you to use the saved words in your answers. Let's start with the first word, "say first word from the vocabulary" 
   "How do you think businesses can adopt practices that ensure they have a positive impact on the environment?"

  ## IMPROTANT: IT'S JUST EXAMPLE YOU **ALWAYS** SHOULD CREATE YOUR OWN STATEMENT. DON'T USE THIS EXAMPLE STATEMENT DIRECTLY.
`;

  protected topics = [
    {
      topic: 'word by word',
      additionalRules: `
      ## WHAT YOU SHOULD DO (EACH RULE IS MANDATORY):
       1. You should introduce the learning vocabulary word by word at the beginning of the conversation. In format like: " We'll aim to use the following words in our conversation: sustainable, persuade, after all, plausible "
       2. You should always clearly emphazise the practised word in the sentence using " ", For instance: "sustainable".
       3. You should pratice vocabulary word by word, so you can start with the first word and go to the last word by word.
       4. You should focus on asking questions, constructed in a way that allows for a logical response containing the practiced word.
       5. You should introduce the word in a sentence, before asking the question.
       6. You should move to the next word when user use the current practicing word in a sentence 1-2 times.
       7. You should mention user to use the currently practicing word in their answer, If they don't use it.

      ${this.exampleStatement}

      ## ADDITIONAL TIPS:
       1. You don't need to create a initial statement one by one like the example above, you can create it by your own way.
       2. Don't always ask the same question, try to ask different questions related to the word.
       3. You can ask questions that are related to the word in a different way.
    `,
    },
    {
      topic: 'blend randomly',
      additionalRules: `
      ## WHAT YOU SHOULD DO (EACH RULE IS MANDATORY):
       1. You should introduce the learning vocabulary at the beginning of the conversation.
       2. You should clearly emphazise the practised word in the sentence using "", For instance: "sustainable". 
       3. You should blend the vocabulary words randomly in a conversation, so you can start with any word from the vocabulary set.
       4. You should focus on using the vocabulary words logically in the conversation according to the context of the conversation.
        
      ${this.exampleStatement}

      ## WHAT YOU SHOULD NOT DO (EACH RULE IS MANDATORY):
       1. You don't need to introduce the word in a sentence before using it in the conversation.
      `,
    },
  ];

  public useVocabulary(flashCards: FlashCard[]) {
    this.topics = this.topics.map((topic) => {
      return {
        ...topic,
        additionalRules: (topic.additionalRules +=
          this.generateVocabularyTable(flashCards)),
      };
    });
  }

  private generateVocabularyTable(flashCards: FlashCard[]): string {
    return flashCards.reduce((acc, flashCard, index) => {
      acc += `${index + 1}. ${flashCard.definition} - ${
        flashCard.translation
      }\n`;
      return acc;
    }, '');
  }
}
