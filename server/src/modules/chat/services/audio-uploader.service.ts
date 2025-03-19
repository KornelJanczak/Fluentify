import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  type PutObjectAclCommandOutput,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AudioUploaderService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
  }

  public async uploadAudio(
    audio: Uint8Array<ArrayBufferLike> | string,
    messageId: string,
  ): Promise<PutObjectAclCommandOutput> {
    console.log('bucketNaame', this.bucketName);
    console.log(
      'AWS_ACCESS_KEY_ID',
      this.configService.get<string>('AWS_ACCESS_KEY_ID'),
    );
    console.log(
      'AWS_SECRET_ACCESS_KEY',
      this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    );
    console.log('AWS_REGION', this.configService.get<string>('AWS_REGION'));
    console.log(
      'AWS_BUCKET_NAME',
      this.configService.get<string>('AWS_BUCKET_NAME'),
    );

    const response = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Body: audio,
        Key: messageId,
        ContentType: 'audio/mpeg',
      }),
    );

    console.log('response', response);

    return response;
  }
}
