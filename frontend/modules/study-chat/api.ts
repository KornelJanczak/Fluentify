const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type InspectorError = {
  original_fragment: string;
  corrected_fragment: string;
  error_type: string;
  explanation: string;
};

export type Inspector = {
  corrected_message: string | null;
  errors: InspectorError[];
};

export type StudyChatResponse = {
  response: string;
  inline_inspector: Inspector;
};

export type StudyChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
  inline_inspector: Inspector | null;
};

export async function getStudyChatHistory(
  flashcardSetId: string,
  accessToken: string,
): Promise<StudyChatHistoryMessage[]> {
  const response = await fetch(
    `${apiUrl}/study-chat/${encodeURIComponent(flashcardSetId)}/history`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(payload?.detail ?? "The chat history could not be loaded.");
  }

  return response.json() as Promise<StudyChatHistoryMessage[]>;
}

export async function sendStudyChatMessage(
  flashcardSetId: string,
  message: string,
  languageLevel: string,
  accessToken: string,
): Promise<StudyChatResponse> {
  const response = await fetch(
    `${apiUrl}/study-chat/${flashcardSetId}/message`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ message, language_level: languageLevel }),
    },
  );

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(
      payload?.detail ?? "The tutor could not process that message.",
    );
  }

  return response.json() as Promise<StudyChatResponse>;
}
