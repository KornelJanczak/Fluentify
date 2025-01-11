import {
  streamText,
  CoreMessage,
  DataStreamWriter,
  pipeDataStreamToResponse,
} from "ai";
import { v4 as uuidv4 } from "uuid";
import { customAi } from "@shared/services/ai";
import {
  type IAudioGeneratorService,
  type IChatRequest,
  type IChatStreamServiceDependencies,
  type ITopicPromptFactory,
  type IChatStreamService,
} from "@chat/chat.interfaces";
import NotFoundError from "@shared/errors/notFoundError";
import { type IChatRepository } from "@shared/repositories/chatRepository";
import { type IMessagesRepository } from "@shared/repositories/messagesRepository";
import TopicPromptBase from "./topicPrompt.service/topicPromptBase";
import { Logger } from "winston";
import { Chat } from "@shared/services/db/schema";
import VocabPracticePrompt from "./topicPrompt.service/vocabPracticePrompt";
import { IFlashCardRepository } from "@shared/repositories/flashCardRepository";

class ChatStreamService implements IChatStreamService {
  private readonly audioGeneratorService: IAudioGeneratorService;
  private readonly topicPromptFactory: ITopicPromptFactory;
  private readonly messagesRepository: IMessagesRepository;
  private readonly chatRepository: IChatRepository;
  private readonly flashCardRepository: IFlashCardRepository;
  private readonly fileName = "chatStream.service";
  private readonly logger: Logger;

  constructor({
    audioGeneratorService,
    topicPromptFactory,
    messagesRepository,
    chatRepository,
    flashCardRepository,
    logger,
  }: IChatStreamServiceDependencies) {
    this.audioGeneratorService = audioGeneratorService;
    this.topicPromptFactory = topicPromptFactory;
    this.messagesRepository = messagesRepository;
    this.chatRepository = chatRepository;
    this.flashCardRepository = flashCardRepository;
    this.logger = logger;
  }

  async startChatStream(chatRequest: IChatRequest): Promise<void> {
    const chat = await this.getChat(chatRequest.chatId);
    const lastUserMessage = this.extractLastUserMessage(chatRequest.messages);

    await this.saveUserMessage(chat.id, lastUserMessage);

    return await this.streamChatToResponse({ ...chatRequest });
  }

  private async getChat(chatId: string): Promise<Chat> {
    const chat = await this.chatRepository.getById(chatId);
    if (!chat) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "getChat",
        message: "Chat not found",
      });
    }
    return chat;
  }

  private extractLastUserMessage(messages: CoreMessage[]): CoreMessage {
    const lastUserMessage = messages
      .filter((message: CoreMessage) => message.role === "user")
      .at(-1);

    return lastUserMessage;
  }

  private async saveUserMessage(
    chatId: string,
    message: CoreMessage
  ): Promise<void> {
    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        ...message,
        createdAt: new Date(),
        chatId: chatId,
        usedTokens: 0,
      },
    ]);
  }

  private async generateTopicPrompt(
    chatCategory: string,
    chatTopic: string,
    vocabularySetId: string
  ): Promise<string> {
    const topicPrompt: TopicPromptBase =
      this.topicPromptFactory.createTopicPrompt(chatCategory, chatTopic);

    if (topicPrompt instanceof VocabPracticePrompt) {
      const vocabulary = await this.getFlashCardsByVocabularySetId(
        vocabularySetId
      );
      console.log('vocabulary', vocabulary);
      
      topicPrompt.useVocabulary(vocabulary);
    }

    return topicPrompt.getTopicPrompt();
  }

  private async getFlashCardsByVocabularySetId(vocabularySetId: string) {
    const flashCards =
      await this.flashCardRepository.getFlashCardsByVocabularySetId(
        vocabularySetId
      );

    if (!flashCards) {
      throw new NotFoundError({
        fileName: this.fileName,
        service: "getFlashCardsByVocabularySetId",
        message: "Flash cards not found",
      });
    }

    return flashCards;
  }

  private async streamChatToResponse(chatRequest: IChatRequest): Promise<void> {
    const {
      res,
      chatId,
      messages,
      userId,
      vocabularySetId,
      chatCategory,
      chatTopic,
    } = chatRequest;

    this.logger.info({
      fileName: this.fileName,
      message: "Start streaming chat...",
      service: "streamChatToResponse",
    });

    const sytemPrompt = await this.generateTopicPrompt(
      chatCategory,
      chatTopic,
      vocabularySetId
    );

    return pipeDataStreamToResponse(res, {
      execute: (streamWriter) => {
        const result = streamText({
          model: customAi("gpt-3.5-turbo"),
          system: sytemPrompt,
          messages,
          onFinish: async ({ text }) =>
            await this.onFinishStream(chatId, text, streamWriter, userId),
        });

        return result.mergeIntoDataStream(streamWriter);
      },
    });
  }

  private async onFinishStream(
    chatId: string,
    text: string,
    streamWriter: DataStreamWriter,
    userId: string
  ): Promise<void> {
    this.logger.info({
      fileName: this.fileName,
      message: "Finished streaming text",
      service: "onFinishStream",
    });

    const { audioContent } = await this.audioGeneratorService.generateAudio(
      text,
      userId
    );

    await this.messagesRepository.saveMessages([
      {
        id: uuidv4(),
        content: text,
        createdAt: new Date(),
        role: "assistant",
        chatId: chatId,
        usedTokens: 0,
      },
    ]);

    streamWriter.writeMessageAnnotation({
      type: "audio",
      data: JSON.stringify(audioContent),
    });
  }
}

export default ChatStreamService;
