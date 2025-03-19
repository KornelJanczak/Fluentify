import { Injectable, VersioningType } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import * as hpp from 'hpp';
// import http from 'http';
import helmet from 'helmet';
import * as compression from 'compression';
// import { globalErrorMiddleware } from '@shared/middleware/error.middleware';
// import HTTP_STATUS from 'http-status-codes';
import * as passport from 'passport';
// import '@auth/strategies/google-strategy';
// import { redisConnection } from '@services/redis/redis.connection';
// import { logger as setupServerLogger } from '@root/logger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisService } from './shared/redis/redis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private redisService: RedisService,
  ) {}

  public configure(app: NestExpressApplication): void {
    this.standardMiddleware(app);
    this.securityMiddleware(app);
    this.passportMiddleware(app);

    // this.globalErrorHandler(this.app);
    // this.startServer(this.app);
  }

  private securityMiddleware(app: NestExpressApplication): void {
    app.set('trust proxy', 1);
    app.use(
      session({
        store: this.createSessionStrore(),
        secret:
          this.configService.get<string>('SESSION') || 'default_session_secret',
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
        },
      }),
    );

    app.use(hpp());
    app.use(helmet());
    app.enableCors({
      origin: this.configService.get<string>('CLIENT_URL'),
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    });
  }

  private standardMiddleware(app: NestExpressApplication): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });
  }

  private createSessionStrore() {
    this.redisService.connect();
    return new RedisStore({
      client: this.redisService.client,
      prefix: 'session',
    });
  }

  private passportMiddleware(app: NestExpressApplication): void {
    app.use(passport.initialize());
    app.use(passport.session());
  }

  // private globalErrorHandler(app: NestExpressApplication): void {
  //   app.use(globalErrorMiddleware);

  //   app.all('*', (req: Request, res: Response) => {
  //     res
  //       .status(HTTP_STATUS.NOT_FOUND)
  //       .json({ message: `${req.originalUrl} not found` });
  //   });
  // }

  // private startServer(app: NestExpressApplication): void {
  //   const httpServer = http.createServer(app);
  //   this.startHttpServer(httpServer);
  // }

  // private startHttpServer(httpServer: http.Server): void {
  //   httpServer.listen(config.PORT, () => {
  //     logger.info(`Server started on port ${config.PORT}`);
  //   });
  // }
}
