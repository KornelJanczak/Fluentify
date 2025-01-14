export interface ITutorPromptService {
  getTutorPrompt(tutorId: string, studyingLanguageLevel: string): string;
}
