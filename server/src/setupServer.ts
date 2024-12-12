import { Application, json, urlencoded, Response, Request } from "express";
import cookieSession from "cookie-session";
import cookieParser from "cookie-parser";
import config from "@root/config";
import hpp from "hpp";
import http from "http";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import apiStats from "swagger-stats";
import applicationRouter from "@root/router";
import { globalErrorMiddleware } from "@shared/middleware/errorMiddleware";
import HTTP_STATUS from "http-status-codes";
import passport from "passport";
import "@shared/strategies/google-strategy";
import session from "express-session";

const logger = config.createLogger("setupServer");

export class FluentifyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.passportMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    app.use(
      cookieSession({
        name: config.COOKIE_SESSION_NAME,
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 24 * 60 * 60 * 1000,
        // secure: config.NODE_ENV !== "development",
        // sameSite: "none",
      })
    );
    // app.use(
    //   session({
    //     secret: "anson the dev",
    //     saveUninitialized: true,
    //     resave: false,
    //     cookie: {
    //       maxAge: 60000 * 60,
    //     },
    //     // store: MongoStore.create({
    //     //   client: mongoose.connection.getClient(),
    //     // }),
    //   })
    // );
    app.use(cookieParser());
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

    app.use(globalErrorMiddleware);
  }

  private startServer(app: Application): void {
    const httpServer = http.createServer(app);
    this.startHttpServer(httpServer);
  }

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(config.PORT, () => {
      logger.info(`Server started on port ${config.PORT}`);
    });
  }
}
