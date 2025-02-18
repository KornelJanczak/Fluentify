import express, { Express } from "express";
import { FluentifyServer } from "@root/setupServer";
import "@auth/strategies/google-strategy";
import { logger as appLogger } from "@root/logger";

const logger = appLogger.createLogger("app");

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: FluentifyServer = new FluentifyServer(app);
    server.start();
    Application.handleExit();
  }

  private static handleExit(): void {
    process.on("uncaughtException", (error: Error) => {
      logger.error({
        message: `There was an uncaught error: ${error.message}`,
        stack: error.stack,
      });
      Application.shutDownProperly(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logger.error({
        message: `Unhandled rejection at promise: ${reason}`,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      logger.error("Caught SIGTERM");
      Application.shutDownProperly(2);
    });

    process.on("SIGINT", () => {
      logger.error({
        service: "SIGINT",
        message: "Caught SIGINT",
      });
      Application.shutDownProperly(2);
    });

    process.on("exit", () => {
      logger.error({
        service: "exit",
        message: "Exiting",
      });
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        logger.info("Shutdown complete");
        process.exit(exitCode);
      })
      .catch((error) => {
        logger.error({
          message: `Error during shutdown: ${error}`,
          stack: error.stack,
        });
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.initialize();
