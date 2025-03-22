import { JSONValue } from "ai";
import { toast } from "sonner";
import { create } from "zustand";

interface AudioStore {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  audioId: string | null;
  playAudio: (audioId: string, audioFromStream?: JSONValue[]) => void;
  pauseAudio: (audioId: string) => void;
}

const initialState = {
  audio: null,
  isPlaying: false,
  audioId: null,
};

export const useAudioStore = create<AudioStore>((set) => ({
  ...initialState,

  playAudio: (newAudioId: string, audioFromStream?: JSONValue[]) => {
    set((state) => {
      if (state.audioId === newAudioId) {
        state.audio.play();
        return {
          audio: state.audio,
          isPlaying: true,
          audioId: newAudioId,
        };
      }

      if (state.audioId !== newAudioId && state.audio) {
        state.audio.pause();
        state.audio.currentTime = 0;
      }

      let audio: HTMLAudioElement;

      if (!audioFromStream)
        audio = new Audio(`${process.env.NEXT_PUBLIC_AWS_URL}/${newAudioId}`);

      if (audioFromStream) {
        const formattedAudio = (audioFromStream.at(-1) as { data: string })
          .data;
        const audioData = JSON.parse(formattedAudio);
        const audioArray = new Uint8Array(audioData.data);
        const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audio = new Audio(audioUrl);
      }

      audio.play();

      audio.addEventListener("ended", () => {
        set({ audio, audioId: newAudioId, isPlaying: false });
      });

      audio.addEventListener("error", () => {
        toast.error("Audio not found, please try again later.");
        set({ audio: null, audioId: newAudioId, isPlaying: false });
      });

      return { audio, audioId: newAudioId, isPlaying: true };
    });
  },

  pauseAudio: (newAudioId: string) => {
    set((state) => {
      if (state.audio) state.audio.pause();
      return {
        isPlaying: false,
        audioId: newAudioId,
        audio: state.audio,
      };
    });
  },
}));
