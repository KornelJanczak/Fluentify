import express, { Express } from "express";
import config from "@root/config";
import { FluentifyServer } from "@root/setupServer";
import "@shared/strategies/google-strategy";

const logger = config.createLogger();

class Application {
  public initialize(): void {
    this.loadConfig();
    const app: Express = express();
    const server: FluentifyServer = new FluentifyServer(app);
    server.start();
    Application.handleExit();
  }

  private loadConfig(): void {
    config.validateConfig();
  }

  private static handleExit(): void {
    process.on("uncaughtException", (error: Error) => {
      logger.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on("unhandleRejection", (reason: Error) => {
      logger.error(`Unhandled rejection at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      logger.error("Caught SIGTERM");
      Application.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      logger.error("Caught SIGINT");
      Application.shutDownProperly(2);
    });

    process.on("exit", () => {
      logger.error("Exiting");
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        logger.info("Shutdown complete");
        process.exit(exitCode);
      })
      .catch((error) => {
        logger.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
