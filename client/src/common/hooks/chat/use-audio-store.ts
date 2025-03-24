import { JSONValue } from "ai";
import { toast } from "sonner";
import { create } from "zustand";

interface AudioStore {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  audioId: string | null;
  playAudio: (audioId: string, audioFromStream?: JSONValue[]) => Promise<void>;
  pauseAudio: (audioId: string) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,
  isPlaying: false,
  audioId: null,

  playAudio: async (newAudioId: string, audioFromStream?: JSONValue[]) => {
    const state = get();

    // Exception 1: Continuing existing audio playing
    if (state.audioId === newAudioId && state.audio) {
      try {
        await state.audio.play();
        set({ isPlaying: true });
      } catch (error) {
        toast.error("Failed to play audio. Please try again.");
        set({ isPlaying: false });
      }
      return;
    }

    // Exception 2: Pausing existing audio
    if (state.audio) {
      state.audio.pause();
      state.audio.currentTime = 0;
    }

    // Exception 3 : Playing new audio
    let newAudio: HTMLAudioElement;

    if (audioFromStream) newAudio = createAudioFromStream(audioFromStream);

    if (!audioFromStream)
      newAudio = new Audio(`${process.env.NEXT_PUBLIC_AWS_URL}/${newAudioId}`);

    // Configure event listeners
    const configuredAudio = setupAudioListeners(
      newAudio,
      newAudioId,
      (audio, id) => set({ audio, audioId: id, isPlaying: false }),
      (id) => {
        toast.error("Voice message not found, please try again later.");
        set({ audio: null, audioId: id, isPlaying: false });
      }
    );

    // Rozpoczęcie odtwarzania z użyciem await
    try {
      await configuredAudio.play();
      set({
        audio: configuredAudio,
        audioId: newAudioId,
        isPlaying: true,
      });
    } catch (playError) {
      toast.error("Failed to play audio. Please try again.");
      set({ audio: null, isPlaying: false, audioId: newAudioId });
    }
  },

  pauseAudio: (audioId: string) => {
    const state = get();

    if (state.audio) state.audio.pause();

    set({
      isPlaying: false,
      audioId,
    });
  },
}));

const createAudioFromStream = (audioStream: JSONValue[]): HTMLAudioElement => {
  const formattedAudio = (audioStream.at(-1) as { data: string })?.data;

  if (!formattedAudio) throw new Error("Invalid audio stream data");

  const audioData = JSON.parse(formattedAudio);
  const audioArray = new Uint8Array(audioData.data);
  const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
  const audioUrl = URL.createObjectURL(audioBlob);

  return new Audio(audioUrl);
};

const setupAudioListeners = (
  audio: HTMLAudioElement,
  audioId: string,
  onEnded: (audio: HTMLAudioElement, id: string) => void,
  onError: (id: string) => void
) => {
  // Remove existing event listeners to avoid duplicates
  const newAudio = audio.cloneNode() as HTMLAudioElement;

  newAudio.addEventListener("ended", () => onEnded(newAudio, audioId));
  newAudio.addEventListener("error", () => onError(audioId));

  return newAudio;
};
