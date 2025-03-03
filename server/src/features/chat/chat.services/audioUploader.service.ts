import {
  type PutObjectAclCommandOutput,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { IAudioUploaderService } from "@chat/chat.interfaces/audioUploader.service.interfaces";
import { config } from "@root/config";
import { s3Client } from "@services/aws";

export default class AudioUploaderService implements IAudioUploaderService {
  public async uploadAudio(
    audio: Uint8Array<ArrayBufferLike> | string,
    messageId: string
  ): Promise<PutObjectAclCommandOutput> {
    const response = await s3Client.send(
      new PutObjectCommand({
      Bucket: config.AWS.BUCKET_NAME,
      Body: audio,
      Key: messageId,
      ContentType: "audio/mpeg",
      })
    );

    console.log("response", response);

    return response;
  }
}
