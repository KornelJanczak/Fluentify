import { Message } from "ai";
import { ThinkingMessage } from "./thinking-message";
import { PreviewMessage } from "./preview-message";
import { memo } from "react";
import equal from "fast-deep-equal";
import { useScrollToBottom } from "@/common/hooks/shared/use-scroll-to-bottom";

export interface MessagesProps {
  isLoading: boolean;
  messages: Array<Message>;
}

function PureMessages({ isLoading, messages }: MessagesProps) {
  const messagesExist = messages.length > 0;
  const lastMessageFromUser =
    messagesExist && messages[messages.length - 1].role === "user";
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  return (
    <div
      ref={messagesContainerRef}
      className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
        />
      ))}

      {isLoading && messagesExist && lastMessageFromUser && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
    </div>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.messages, nextProps.messages)) return false;
  return true;
});
