export const chatTopics = [
  {
    title: "Practise vocabulary",
    categories: [
      {
        title: "Practise vocabulary word by word",
        category: "vocabulary",
        topic: "word by word",
      },
      {
        title: "Blend vocabulary words randomly",
        category: "vocabulary",
        topic: "blend randomly",
      },
    ],
  },
  {
    title: "Chat about anything",
    categories: [
      {
        title: "General chat",
        category: "anything",
        topic: "free chat",
      },
      {
        title: "Focus on slangs and idioms",
        category: "anything",
        topic: "slangs and idioms",
      },
      {
        title: "My interests",
        category: "anything",
        topic: "my interests",
      },
    ],
  },
];

export type ChatTopic = typeof chatTopics[0];
