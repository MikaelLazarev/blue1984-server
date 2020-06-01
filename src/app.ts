import "reflect-metadata";
import { ConfigParams } from "./config/config";
import express, { Application } from "express";
import cors from "cors";
import { morganLogger } from "./middleware/logger";
import bodyParser from "body-parser";
import container from "./config.inversify";
import { TYPES } from "./types";
import errorHandler from "./middleware/errorHandler";
import { AccountsController } from "./controllers/accountsController";
import { TweetsController } from "./controllers/tweetsController";
import { BluzelleHelper } from "./repository/bluzelleHelper";
import * as path from "path";
import { DbController } from "./controllers/dbController";
import * as Sentry from "@sentry/node";
// or using CommonJS
// const Sentry = require('@sentry/node');

export function createApp(config: ConfigParams): Promise<Application> {
  return new Promise<Application>(async (resolve) => {

    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        dsn:
            config.sentryDSN,
      });
    }


    const app = express();
    app.use(
      cors({
        credentials: true,
        origin: "*",
      })
    );

    app.use(morganLogger);

    app.use(bodyParser.json());

    BluzelleHelper.globalConfig = {
      mnemonic: config.bluzelle_mnemonic,
      uuid: "",
      endpoint: config.bluzelle_endpoint,
      chain_id: config.bluzelle_chain_id,
    };

    const accountsController = container.get<AccountsController>(
      TYPES.AccountsController
    );

    const tweetsController = container.get<TweetsController>(
      TYPES.TweetsController
    );

    const dbController = new DbController();

    // Accounts Controller
    app.post("/api/accounts/list/", accountsController.list());
    app.post("/api/accounts/feed/", accountsController.feed());
    app.post("/api/accounts/", accountsController.create());
    app.get("/api/accounts/start", accountsController.startUpdates());
    app.get("/api/accounts/stop", accountsController.stopUpdates());
    app.get("/api/accounts/:id/", accountsController.retrieve());
    app.get("/api/stat/", dbController.retrieve());

    // app.use(express.static(path.join(__dirname, "../client/build/")));
    // app.get("*", (req, res) => {
    //   res.sendFile(path.join(__dirname + "/client/build/index.html"));
    // });
    // Tweets Controller
    app.get("/api/tweets/:blu_id/:id/", tweetsController.retrieve());

    // ERROR HANDLER
    app.use(errorHandler);
    let server = require("http").Server(app);
    resolve(server);
  });
}
