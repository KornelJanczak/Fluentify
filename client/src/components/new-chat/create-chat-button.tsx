import { useCreateChat } from "@/common/hooks/chat/use-create-chat";
import { Button } from "../ui/button";

interface CreateChatButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  title: string;
  topic: string;
  category: string;
}

export function CreateChatButton(props: CreateChatButtonProps) {
  const { title, topic, category, ...restOfProps } = props;
  const { mutate } = useCreateChat();

  return (
    <Button
      key={title}
      size="lg"
      {...restOfProps}
      onClick={() => mutate({ topic, category })}
    >
      {title}
    </Button>
  );
}
