/*
 * Stackdrive. Self-order apps for business
 * Copyright (c) 2020. Mikhail Lazarev
 */

import { IsNotEmpty, validate } from "class-validator";
import { Service } from "typedi";
import { config } from "dotenv";
import * as fs from "fs";

@Service()
export class ConfigService {
  port: number;

  @IsNotEmpty()
  bluzelle_mnemonic: string;

  @IsNotEmpty()
  bluzelle_endpoint: string;

  @IsNotEmpty()
  mainDB: string;

  @IsNotEmpty()
  sentryDSN: string;

  @IsNotEmpty()
  updateDelay: number;

  @IsNotEmpty()
  twitterBearerToken: string;

  @IsNotEmpty()
  dbType: string;

  constructor() {
    if (fs.existsSync(".env.local")) {
      config({ path: ".env.local" });
    } else {
      config();
    }

    this.port = parseInt(process.env.PORT || "4000");

    this.bluzelle_mnemonic = process.env.BLUZELLE_MNEMONIC || "";
    this.bluzelle_endpoint = process.env.BLUZELLE_ENDPOINT || "";
    this.mainDB = process.env.MAIN_DB || "";
    this.sentryDSN = process.env.SENTRY_DSN || "";
    this.updateDelay = parseInt(process.env.UPDATE_DELAY || "0");
    this.twitterBearerToken = process.env.TWITTER_BEARER_TOKEN || "";
    this.dbType = process.env.DB_TYPE || "";
  }

  async validate() {
    console.log("Loading configuration...");

    const errors = await validate(this);
    if (errors.length > 0)
      throw new Error(`Configuration problems: ${errors.join("\n")}`);
  }
}
