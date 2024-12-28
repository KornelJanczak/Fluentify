import { IAudioGenerator } from "@chat/chat.interfaces";
import { textToSpeechClient } from "@shared/services/textToSpeech";

class AudioGenerator implements IAudioGenerator {
  execute(): void {}

  private async generateAudio(text: string) {
    const [response] = await textToSpeechClient.synthesizeSpeech({
      input: { text: text },
      voice: {
        languageCode: "en-US",
        ssmlGender: "FEMALE",
        name: "en-US-Journey-F",
      },
      audioConfig: { audioEncoding: "MP3" },
    });
  }

  private async saveAudioFile() {}
}
