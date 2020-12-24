/*
 * Buzzzchat - P2P Chat based on Bluzelle DB
 * Copyright (c) 2020. Mikhail Lazarev
 */

import { API } from "bluzelle";
import { v4 as uuidv4 } from "uuid";
import NodeCache from "node-cache";
import { Db } from "../core/db";
import { ErrorHandler } from "../middleware/errorHandler";
import { BluzelleAPI } from "./bluzelleAPI";

const REPEAT_QTY = 2;

export class BluzelleHelper<T> {
  private static _cache = new NodeCache({ deleteOnExpire: true, stdTTL: 100 });

  private readonly _uuid: string;

  constructor(uuid: string) {
    this._uuid = uuid;
  }

  get uuid() {
    return this._uuid;
  }

  async findOne(id: string, repeat?: number): Promise<T | undefined> {
    try {
      if (BluzelleHelper._cache.has(this.getItemHash(id))) {
        console.log("got from cache");
        return BluzelleHelper._cache.get<T>(this.getItemHash(id));
      }

      const api = await this.findInList(id, this._uuid);
      if (api === undefined) return undefined;

      const dataStr = await api.read(id);
      return JSON.parse(dataStr);
    } catch (e) {
      const repeatQty = repeat === undefined ? REPEAT_QTY : repeat - 1;
      if (repeatQty <= 0) {
        ErrorHandler.captureException(e);
        return;
      }

      console.log(
        `[Bluzelle FindOne]: Error:, DB: ${this._uuid}\n Try attempt: ${
          REPEAT_QTY - repeatQty
        }`
      );
      return await this.findOne(id, repeatQty);
    }
  }

  private async findInList(
    key: string,
    initialUUID: string
  ): Promise<API | undefined> {
    let next = initialUUID;
    while (true) {
      // Calculates time for each operation
      const api = await BluzelleAPI.getBluzelle(next);
      if (await api.has(key)) {
        return api;
      }
      if (!(await api.has("Next"))) {
        return undefined;
      }
      next = await api.read("Next");
    }
  }

  async list(repeat?: number): Promise<T[] | undefined> {
    try {
      if (BluzelleHelper._cache.has(this.getLishHash())) {
        return BluzelleHelper._cache.get<T[]>(this.getLishHash());
      }

      let data: T[] = [];
      let next: string | undefined = this._uuid;

      do {
        // Calculates time for each operation
        const startTime = Date.now();
        const api = await BluzelleAPI.getBluzelle(next);
        const dataStr = await api.keyValues();
        Db.addKeyValuesTime(Date.now() - startTime);

        next = undefined;

        dataStr.forEach(({ key, value }) => {
          if (key === "Next") {
            next = value;
            return;
          }
          BluzelleHelper._cache.set(this.getItemHash(key), JSON.parse(value));
          data.push(JSON.parse(value) as T);
        });
      } while (next !== undefined);

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
      const startTime = Date.now();
      let api: API;

      let uuid = this._uuid;
      while (true) {
        api = await BluzelleAPI.getBluzelle(uuid);
        const next = (await api.has("Next"))
          ? await api.read("Next")
          : undefined;
        if (next === undefined) {
          break;
        }
        uuid = next;
      }

      // Create new UUID
      if ((await api.count()) > 49) {
        const newUUID = uuidv4();
        await api.create("Next", newUUID, BluzelleAPI.gasPrice);
        uuid = newUUID;
        api = await BluzelleAPI.getBluzelle(uuid);
      }

      await api.create(key, JSON.stringify(item), BluzelleAPI.gasPrice);
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
      console.log(e);
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
      const api = await this.findInList(key, this._uuid);
      if (api === undefined) return undefined;

      const startTime = Date.now();
      await api.update(key, JSON.stringify(item), BluzelleAPI.gasPrice);
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

  async delete(key: string, repeat?: number): Promise<void> {
    try {
      const api = await this.findInList(key, this._uuid);
      if (api === undefined) return undefined;

      await api.delete(key, BluzelleAPI.gasPrice);
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
