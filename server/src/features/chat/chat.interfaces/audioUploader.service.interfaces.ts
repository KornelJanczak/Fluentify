import { PutObjectAclCommandOutput } from "@aws-sdk/client-s3";

export interface IAudioUploaderService {
  uploadAudio(
    audio: Uint8Array<ArrayBufferLike> | string,
    messageId: string
  ): Promise<PutObjectAclCommandOutput>;
}
