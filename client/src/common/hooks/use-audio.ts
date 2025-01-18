interface UseAudioPlayerProps {
  message: any;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const useAudioPlayer = ({ message, audioRef }: UseAudioPlayerProps) => {
  if (message.annotations && message.annotations.length > 0) {
    const audio = JSON.parse(message.annotations.at(-1).data);
    const audioArray = new Uint8Array(audio.data);
    const audioBlob = new Blob([audioArray], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef !== null && audioRef.current !== null) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  }
};
