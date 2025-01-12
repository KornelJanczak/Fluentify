class TutorPromptService {
  private tutorName: string;
  private tutors = [
    {
      tutorName: "John",
      languageCode: "en-US",
      ssmlGender: "MALE",
      name: "en-US-Casual-K",
      behaviourRules: `
      #  

      `
    },
    {
      tutorName: "Emily",
      languageCode: "en-US",
      ssmlGender: "FEMALE",
      name: "en-US-Journey-F",
    },

    {
      tutorName: "Oliver",
      languageCode: "en-GB",
      ssmlGender: "MALE",
      name: "en-GB-Journey-D",
    },
    {
      tutorName: "Victoria",
      languageCode: "en-GB",
      ssmlGender: "FEMALE",
      name: "en-GB-Journey-F",
    },
    {
      tutorName: "Nicole",
      languageCode: "en-AU",
      ssmlGender: "MALE",
      name: "en-AU-Journey-D",
    },
    {
      tutorName: "Charlotte",
      languageCode: "en-AU",
      ssmlGender: "FEMALE",
      name: "en-AU-Neural2-C",
    },
  ];

  constructor(tutorName: string) {
    this.tutorName = tutorName;
  }
}
