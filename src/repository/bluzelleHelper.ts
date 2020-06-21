/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */

import { bluzelle, API } from "bluzelle";
import { v4 as uuidv4 } from "uuid";
import { GasInfo } from "bluzelle/lib/GasInfo";
import { BluzelleConfig } from "bluzelle/lib/BluzelleConfig";
import NodeCache from "node-cache";
import { Db } from "../core/db";
import { ErrorHandler } from "../middleware/errorHandler";

const REPEAT_QTY = 2;

export class BluzelleHelper<T> {
  private static _globalConfig: BluzelleConfig;
  private static _cache = new NodeCache({ deleteOnExpire: true, stdTTL: 100 });
  private static _account: string;
  private static _amount: string;

  private _config: BluzelleConfig;
  private _uuid: string;
  private _api: API;
  private static gasPrice: GasInfo = {
    gas_price: 10,
  };

  constructor(uuid: string) {
    this._config = {...BluzelleHelper._globalConfig};
    this._config.uuid = uuid;
    this._uuid = uuid;
  }

  static set globalConfig(value: BluzelleConfig) {
    this._globalConfig = value;
  }

  get uuid() {
    return this._uuid;
  }

  static get account(): string {
    return this._account;
  }

  static get amount(): string {
    return this._amount;
  }

  async findOne(id: string, repeat?: number): Promise<T | undefined> {
    try {
      if (BluzelleHelper._cache.has(this.getItemHash(id))) {
        console.log("got from cache");
        return BluzelleHelper._cache.get<T>(this.getItemHash(id));
      }
      const api = await this.getBluzelle();
      const has = await api.has(id);
      if (!has) {
        return undefined;
      }
      const dataStr = await api.read(id);
      return JSON.parse(dataStr);
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(e);
        return;
      }
      console.log(
        `[Bluzelle FindOne]: Error, DB: ${this._uuid}\n${e} Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.findOne(id, repeatQty);
    }
  }

  async list(repeat?: number): Promise<T[] | undefined> {
    try {
      // if (BluzelleHelper._cache.has(this.getLishHash())) {
      //   return BluzelleHelper._cache.get<T[]>(this.getLishHash());
      // }

      console.log(this._config);

      const api = await this.getBluzelle();

      const startTime = Date.now();
      const dataStr = await api.keyValues();
      Db.addKeyValuesTime(Date.now() - startTime);

      const data = dataStr.map(({ key, value }) => {
        BluzelleHelper._cache.set(this.getItemHash(key), JSON.parse(value));
        return JSON.parse(value);
      });

      BluzelleHelper._cache.set(this.getLishHash(), data);
      return data;
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(e);
        return;
      }
      console.log(
        `[Bluzelle List]: Error, DB: ${this._uuid}\n${e} Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.list(repeatQty);
    }
  }

  async create(
    key: string,
    item: T,
    repeat?: number
  ): Promise<string | undefined> {
    try {
      const api = await this.getBluzelle();

      const startTime = Date.now();
      await api.create(key, JSON.stringify(item), BluzelleHelper.gasPrice);
      Db.addCreateTime(Date.now() - startTime);

      BluzelleHelper._cache.del(this.getItemHash(key));
      BluzelleHelper._cache.del(this.getLishHash());
      return key;
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(e);
        return;
      }
      console.log(
        `[Bluzelle Create]:Error, DB: ${this._uuid}\n${e} Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.create(key, item, repeatQty);
    }
  }

  async insert(item: T): Promise<string | undefined> {
    const key = await this.create(uuidv4(), item);
    if (key === undefined) throw "Cant create an element";
    BluzelleHelper._cache.set(this.getItemHash(key), item);
    BluzelleHelper._cache.del(this.getLishHash());
    return key;
  }

  async update(key: string, item: T, repeat?: number): Promise<void> {
    try {
      const api = await this.getBluzelle();

      const startTime = Date.now();
      await api.update(key, JSON.stringify(item), BluzelleHelper.gasPrice);
      Db.addUpdateTime(Date.now() - startTime);

      BluzelleHelper._cache.set(this.getItemHash(key), item);
      BluzelleHelper._cache.del(this.getLishHash());
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(new Error(`Bluzelle:Update ${e}`));
        return;
      }
      console.log(
        `[Bluzelle Update]: Error, DB: ${this._uuid}\n${e} Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.update(key, item, repeatQty);
    }
  }

  async getBluzelle(): Promise<API> {
    if (this._api === undefined) {
      this._api = await bluzelle(this._config);

      if (this._api === undefined) {
        throw "Wrong mnemonic";
      }

      const account = await this._api.account();
      console.log("ACCOUNT", account);

      if (account.address === "") {
        throw "Wrong mnemonic";
      }

      BluzelleHelper._account = account.address;
      BluzelleHelper._amount =
        account.coins.length > 0 ? account.coins[0].amount : "ZERO";
    }

    return this._api;
  }

  async delete(key: string, repeat?: number): Promise<void> {
    try {
      const api = await this.getBluzelle();
      const has = await api.has(key);
      if (!has) {
        return undefined;
      }
      await api.delete(key, BluzelleHelper.gasPrice);
      BluzelleHelper._cache.del(this.getItemHash(key));
      BluzelleHelper._cache.del(this.getLishHash());
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(e);
        return;
      }
      console.log(
        `[Bluzelle Delete]: Error, DB: ${this._uuid}\n${e} Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.delete(key, repeatQty);
    }
  }

  private getLishHash(): string {
    return this._uuid + "!LIST";
  }

  private getItemHash(key: string): string {
    return this._uuid + "@" + key;
  }
}
