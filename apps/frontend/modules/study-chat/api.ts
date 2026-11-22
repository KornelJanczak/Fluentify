import { resolveApiUrl } from "@/infrastructure/http/client";

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
    resolveApiUrl(`/study-chat/${encodeURIComponent(flashcardSetId)}/history`),
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
    resolveApiUrl(`/study-chat/${flashcardSetId}/message`),
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

export type TranscriptionResponse = {
  text: string;
};

export async function transcribeStudyChatAudio(
  audioBlob: Blob,
  languageLevel: string,
  accessToken: string,
): Promise<TranscriptionResponse> {
  const formData = new FormData();
  const filename = audioBlob.type.includes("mp4")
    ? "recording.mp4"
    : "recording.webm";
  formData.append("file", audioBlob, filename);
  formData.append("language_level", languageLevel);

  const response = await fetch(resolveApiUrl("/study-chat/transcribe"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(
      payload?.detail ?? "Failed to transcribe audio. Please try again.",
    );
  }

  return response.json() as Promise<TranscriptionResponse>;
}

export async function ensureLangGraphThread(
  apiUrl: string,
  threadId: string,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`${apiUrl}/threads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      thread_id: threadId,
      if_exists: "do_nothing",
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(
      payload?.detail ?? `Failed to initialize chat thread: ${response.status}`,
    );
  }
}

export type CartesiaTokenResponse = {
  access_token: string;
  expires_at: number;
};

export async function getCartesiaTTSToken(
  accessToken: string,
): Promise<CartesiaTokenResponse> {
  const response = await fetch(resolveApiUrl("/study-chat/tts/token"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(payload?.detail ?? "Could not obtain a TTS access token.");
  }

  return response.json() as Promise<CartesiaTokenResponse>;
}

export type TTSAudioUploadResponse = {
  key: string;
  url: string;
};

export async function uploadTTSAudio(
  flashcardSetId: string,
  audioBlob: Blob,
  accessToken: string,
): Promise<TTSAudioUploadResponse> {
  const formData = new FormData();
  formData.append("flashcard_set_id", flashcardSetId);
  formData.append("file", audioBlob, "tts.wav");

  const response = await fetch(resolveApiUrl("/study-chat/tts/audio"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      detail?: string;
    } | null;
    throw new Error(payload?.detail ?? "Failed to upload TTS audio.");
  }

  return response.json() as Promise<TTSAudioUploadResponse>;
}
