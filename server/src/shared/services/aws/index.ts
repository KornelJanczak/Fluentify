import { S3Client } from "@aws-sdk/client-s3";
import { config } from "@root/config";

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: config.AWS.ACCESS_KEY,
    secretAccessKey: config.AWS.SECRET_ACCESS_KEY,
  },
  region: config.AWS.REGION,
});
