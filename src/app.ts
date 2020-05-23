import "reflect-metadata"
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

export function createApp(config: ConfigParams): Promise<Application> {
  return new Promise<Application>(async (resolve) => {

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

    const tweetsController = container.get<TweetsController>(
      TYPES.TweetsController
    );

    const accountsController = container.get<AccountsController>(
      TYPES.AccountsController
    );

    app.get("/", (req, res) => {
      console.log(req);
      res.status(200).send("It works!");
    });

    // Tweets Controller
    app.get("/api/tweets/:id", tweetsController.retrieve());

    // Accounts Controller
    app.get("/api/accounts/", accountsController.list());
    app.post("/api/accounts/", accountsController.create());

    // ERROR HANDLER
    app.use(errorHandler);
    let server = require("http").Server(app);
    resolve(server);
  });
}
