// import { create } from "zustand";

// interface AudioStore {
//   audioRef: React.RefObject<HTMLAudioElement> | null;
//   isPlaying: boolean;
//   playingAudioId: string;
//   playAudio: (
//     playingAudioId: string,
//     audioFromStream?: { data: string; type: string }
//   ) => void;
//   stopAudio: () => void;
//   pauseAudio: () => void;
// }

// const initialState = {
//   audioRef: null,
//   isPlaying: false,
//   playingAudioId: "",
// };

// export const useAudioStore = create<AudioStore>((set) => ({
//   ...initialState,

//   playAudio: (
//     playingAudioId: string,
//     audioFromStream: { data: string; type: string }
//   ) => {
//     set(({ audioRef }) => {
//       if (audioFromStream) {
//         //@ts-ignore
//         console.log("audio from stream", audioFromStream.at(-1).data);

//         //@ts-ignore
//         const audio = JSON.parse(audioFromStream.at(-1).data);
//         const audioArray = new Uint8Array(audio.data);
//         const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
//         const audioUrl = URL.createObjectURL(audioBlob);

//         if (audioRef !== null && audioRef.current !== null) {
//           audioRef.current.src = audioUrl;
//           audioRef.current.play();
//         }
//       }

//       if (!audioFromStream) {
//         audioRef.current.src = `https://korneljanczak-product-feedback-app.s3.eu-north-1.amazonaws.com/${playingAudioId}`;
//         audioRef.current.play();
//       }

//       return { playingAudioId, isPlaying: true };
//     });
//   },

//   stopAudio: () => {
//     set(({ audioRef }) => {
//       if (audioRef) {
//         audioRef.current.pause();
//         audioRef.current.currentTime = 0;
//       }
//       return { audioRef: null, isPlaying: false };
//     });
//   },

//   pauseAudio: () => {
//     set(({ audioRef }) => {
//       if (audioRef) {
//         audioRef.current.pause();
//       }
//       return { isPlaying: false };
//     });
//   },
// }));

import { create } from "zustand";

interface AudioStore {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  playingAudioId: string;
  playAudio: (
    playingAudioId: string,
    audioFromStream?: { data: string; type: string }
  ) => void;
  stopAudio: () => void;
  pauseAudio: () => void;
}

const initialState = {
  audio: null,
  isPlaying: false,
  playingAudioId: "",
};

export const useAudioStore = create<AudioStore>((set) => ({
  ...initialState,

  playAudio: (
    playingAudioId: string,
    audioFromStream?: { data: string; type: string }
  ) => {
    set((state) => {
      if (state.playingAudioId === playingAudioId) {
        console.log("playing audio", playingAudioId, state);
        state.audio.play();
        return { audio: state.audio, isPlaying: true };
      }

      let audio: HTMLAudioElement;

      if (audioFromStream) {
        //@ts-ignore
        const audioData = JSON.parse(audioFromStream.at(-1).data);
        const audioArray = new Uint8Array(audioData.data);
        const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audio = new Audio(audioUrl);
        console.log("audio from stream", playingAudioId, state);
      } else {
        audio = new Audio(
          `https://korneljanczak-product-feedback-app.s3.eu-north-1.amazonaws.com/${playingAudioId}`
        );
        console.log("audio from aws", playingAudioId, state);
      }

      audio.play();

      return { audio, playingAudioId, isPlaying: true };
    });
  },

  stopAudio: () => {
    set((state) => {
      if (state.audio) {
        state.audio.pause();
        state.audio.currentTime = 0;
      }
      return { audio: null, isPlaying: false, playingAudioId: "" };
    });
  },

  pauseAudio: () => {
    set((state) => {
      console.log("pausing audio", state);

      if (state.audio) {
        state.audio.pause();
      }

      return { isPlaying: false };
    });
  },
}));
