import "reflect-metadata";
import express, {Application} from "express";
import {useContainer, useExpressServer} from "routing-controllers";
import {morganLogger} from "./middleware/logger";
import {AccountsController} from "./controllers/accountsController";
import {TweetsController} from "./controllers/tweetsController";
import {DbController} from "./controllers/dbController";
import * as Sentry from "@sentry/node";
import {BluzelleAPI} from "./repository/bluzelleAPI";
import {Container} from "typedi";
import {ConfigService} from "./config";

export async function createApp(): Promise<Application> {
  const config = Container.get(ConfigService);
  await config.validate();

  const app = express();

  if (process.env.NODE_ENV !== "development") {
    Sentry.init({
      dsn: config.sentryDSN,
      integrations: [
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
    });
    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());
    // The error handler must be before any other error middleware
    app.use(Sentry.Handlers.errorHandler());
  }

  app.use(morganLogger);

  BluzelleAPI.globalConfig = {
    mnemonic: config.bluzelle_mnemonic,
    uuid: "",
    endpoint: config.bluzelle_endpoint,
    chain_id: config.bluzelle_chain_id,
  };

  console.log(`Bluzelle account: ${await BluzelleAPI.getAccount()}`);

  useContainer(Container);
  useExpressServer(app, {
    controllers: [AccountsController, TweetsController, DbController],
    cors: {
      origin: "*",
    },
    validation: true,
  });

  return require("http").Server(app);
}
