import express, { Express } from "express";
import { config } from "@root/config";
import { FluentifyServer } from "@root/setupServer";
import "@auth/strategies/google-strategy";

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
      logger.error({
        service: "uncaughtException",
        message: `There was an uncaught error: ${error.message}`,
        stack: error.stack,
      });
      Application.shutDownProperly(1);
    });

    process.on("unhandledRejection", (reason: any) => {
      logger.error({
        service: "unhandledRejection",
        message: `Unhandled rejection at promise: ${reason}`,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
      Application.shutDownProperly(2);
    });

    process.on("SIGTERM", () => {
      logger.error({
        service: "SIGTERM",
        message: "Caught SIGTERM",
      });
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
        logger.info({
          service: "shutDownProperly",
          message: "Shutdown complete",
        });
        process.exit(exitCode);
      })
      .catch((error) => {
        logger.error({
          service: "shutDownProperly",
          message: `Error during shutdown: ${error}`,
        });
        process.exit(1);
      });
  }
}

const logger = config.createLogger("app");
const application: Application = new Application();
application.initialize();
