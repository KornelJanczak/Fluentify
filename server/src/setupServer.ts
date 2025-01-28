import { Application, json, urlencoded, Response, Request } from "express";
import session from "express-session";
import { RedisStore } from "connect-redis";
import cookieParser from "cookie-parser";
import { config } from "@root/config";
import hpp from "hpp";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import apiStats from "swagger-stats";
import applicationRouter from "@root/router";
import applicationContainer from "@root/container";
import { globalErrorMiddleware } from "@shared/middleware/error.middleware";
import HTTP_STATUS from "http-status-codes";
import passport from "passport";
import "@auth/strategies/google-strategy";
import { redisConnection } from "@services/redis/redis.connection";

const logger = config.createLogger("setupServer");

export class FluentifyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.standardMiddleware(this.app);
    this.securityMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.passportMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.awilixContainer(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    // app.use(
    //   cookieSession({
    //     name: config.COOKIE_SESSION_NAME,
    //     keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
    //     maxAge: 24 * 60 * 60 * 1000,
    //     // secure: config.NODE_ENV !== "development",
    //     // sameSite: "none",
    //   })
    // );

    app.use(cookieParser());
    app.use(
      session({
        store: this.createSessionStrore(),
        secret: config.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
          maxAge: 60000 * 60,
        },
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      })
    );
  }

  private createSessionStrore(): RedisStore {
    redisConnection.connect();
    return new RedisStore({
      client: redisConnection.client,
      prefix: "session",
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }

  private passportMiddleware(app: Application): void {
    app.use(passport.initialize());
    app.use(passport.session());
  }

  private routesMiddleware(app: Application): void {
    applicationRouter(app);
  }

  private awilixContainer(app: Application): void {
    applicationContainer(app);
  }
  private apiMonitoring(app: Application): void {
    app.use(
      apiStats.getMiddleware({
        uriPath: "/api-monitoring",
      })
    );
  }

  private globalErrorHandler(app: Application): void {
    app.all("*", (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: `${req.originalUrl} not found` });
    });

    //@ts-ignore
    app.use(globalErrorMiddleware);
  }

  private startServer(app: Application): void {
    const httpServer = http.createServer(app);
    this.startHttpServer(httpServer);
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(config.PORT, () => {
      logger.info({
        message: `Server started on port ${config.PORT}`,
        service: "startHttpServer",
      });
    });
  }
}
