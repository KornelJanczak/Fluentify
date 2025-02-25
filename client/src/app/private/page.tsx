
import CreateChatButton from "@/components/chat/create-chat-button";

import { redirect } from "next/dist/server/api-utils";

export default async function PrivatePage() {

  return (
    <>
      <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
        Private Page
      </h1>

      <CreateChatButton />
    </>
  );
}
