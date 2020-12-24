/*
 * Stackdrive. Self-order apps for business
 * Copyright (c) 2020. Mikhail Lazarev
 */

import { IsNotEmpty, validate } from "class-validator";
import { Service } from "typedi";
import { config } from "dotenv";

@Service()
export class ConfigService {
  port: number;

  @IsNotEmpty()
  bluzelle_mnemonic: string;

  @IsNotEmpty()
  bluzelle_endpoint: string;

  @IsNotEmpty()
  bluzelle_chain_id: string;

  @IsNotEmpty()
  mainDB: string;

  @IsNotEmpty()
  sentryDSN: string;

  @IsNotEmpty()
  updateDelay: number;

  @IsNotEmpty()
  twitterBearerToken: string;

  constructor() {
    config();

    this.port = parseInt(process.env.PORT || "4000");

    this.bluzelle_mnemonic = process.env.BLUZELLE_MNEMONIC || "";
    this.bluzelle_endpoint = process.env.BLUZELLE_ENDPOINT || "";
    this.bluzelle_chain_id = process.env.BLUZELLE_CHAIN_ID || "";
    this.mainDB = process.env.MAIN_DB || "";
    this.sentryDSN = process.env.SENTRY_DSN || "";
    this.updateDelay = parseInt(process.env.UPDATE_DELAY || "0");
    this.twitterBearerToken = process.env.TWITTER_BEARER_TOKEN || "";
  }

  async validate() {
    console.log("Loading configuration...");

    const errors = await validate(this);
    if (errors.length > 0)
      throw new Error(`Configuration problems: ${errors.join("\n")}`);
  }
}
