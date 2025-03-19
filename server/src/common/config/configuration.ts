export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  sessionSecret: process.env.SESSION_SECRET || '',
  clientUrl: process.env.CLIENT_URL || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  bullBasePath: process.env.BULL_BASE_PATH || '',
  secrets: {
    one: process.env.SECRET_KEY_ONE || '',
    two: process.env.SECRET_KEY_TWO || '',
  },
  redis: {
    host: process.env.REDIS_HOST || '',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
    applicationCredentials: process.env.GOOGLE_APPLICATION_CREDENTIALS || '',
  },
  aws: {
    bucketName: process.env.AWS_BUCKET_NAME || '',
    accessKey: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || '',
  },
});
