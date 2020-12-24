import { createApp } from "./app";
import { ErrorHandler } from "./middleware/errorHandler";
import {Container} from "typedi";
import {ConfigService} from "./config";

process.on("uncaughtException", (e) => {
  ErrorHandler.captureException(e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  ErrorHandler.captureException(new Error("unhandledRejection " + e));
  process.exit(1);
});

createApp().then((server) => {
  const config = Container.get(ConfigService);
  server.listen(config.port, () =>
    ErrorHandler.captureMessage(`Listening on port ${config.port}...`)
  );
});
