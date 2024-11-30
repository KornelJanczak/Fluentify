import { StreamTextResult, CoreTool } from "ai";

export type AIConversationResult = Promise<
  StreamTextResult<Record<string, CoreTool<any, any>>>
>;

export interface AIConversationAbstract {
  startConversation(): AIConversationResult;
}


export interface AIConversationControllerAbsract {}