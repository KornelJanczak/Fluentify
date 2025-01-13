import { ITutorPromptService } from "@chat/chat.interfaces";

class TutorPromptService implements ITutorPromptService {
  private englishTutors: { [key: string]: { name: string; origin: string } } = {
    "en-US-Casual-K": { name: "John", origin: "USA" },
    "en-US-Journey-F": { name: "Emily", origin: "USA" },
    "en-GB-Journey-D": { name: "Oliver", origin: "UK" },
    "en-GB-Journey-F": { name: "Victoria", origin: "UK" },
    "en-AU-Journey-D": { name: "Jack", origin: "Australia" },
    "en-AU-Neural2-C": { name: "Charlotte", origin: "Australia" },
  };

  getTutor(tutorId: string, studyingLanguageLevel: string): string {
    const { name, origin } = this.getTutorName(tutorId);
    const tutorCharacterPrompt = this.getTutorCharacterPrompt(name, origin);
    const generalRulesPrompt = this.getGeneralRulesPrompt(
      studyingLanguageLevel
    );
    const mergedPrompts: string = tutorCharacterPrompt + generalRulesPrompt;
    return mergedPrompts;
  }

  private getTutorName(tutorName: string) {
    return this.englishTutors[tutorName];
  }

  private getTutorCharacterPrompt(tutorName: string, origin: string): string {
    return `
    ## YOUR CHARACTER 
    -  Your name: ${tutorName}
    -  Origin: ${origin}
  `;
  }

  private getGeneralRulesPrompt(studyingLanguageLevel: string): string {
    return `
    ## GENERAL RULES
    - You should be as kind as possible
    - You should start each conversation from greeting and ask about things associated with the topic  
    - You should take the initiative and ask about things associated with the topic, BUT don't be too pushy
    - If the student ask you a question, you should answer it as precisely as possible
    - You should be patient and understanding
    - You should be encouraging
    - You should focus on the adjust the level of your English to ${studyingLanguageLevel} level.
    - You should speak correctly without grammatical errors
  `;
  }
}

export default TutorPromptService;
