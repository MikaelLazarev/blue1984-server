import { bluzelle, API } from "bluzelle";
import { v4 as uuidv4 } from "uuid";
import { GasInfo } from "bluzelle/lib/GasInfo";
import { BluzelleConfig } from "bluzelle/lib/BluzelleConfig";
import NodeCache from "node-cache";

export class BluzelleHelper<T> {
  private static _globalConfig: BluzelleConfig;
  private static _cache = new NodeCache({ deleteOnExpire: true, stdTTL: 100 });
  private _config: BluzelleConfig;
  private _uuid: string;
  private _api: API;
  private static gasPrice: GasInfo = {
    gas_price: 10,
  };

  constructor(uuid: string) {
    this._config = BluzelleHelper._globalConfig;
    this._config.uuid = uuid;
    this._uuid = uuid;
  }

  static set globalConfig(value: BluzelleConfig) {
    this._globalConfig = value;
  }

  get uuid() {
    return this._uuid;
  }

  async findOne(id: string): Promise<T | undefined> {

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
  }

  async list(): Promise<T[] | undefined> {
    if (BluzelleHelper._cache.has(this.getLishHash())) {
      return BluzelleHelper._cache.get<T[]>(this.getLishHash());
    }

    const api = await this.getBluzelle();

    const dataStr = await api.keyValues();

    const data = dataStr.map(({ key, value }) => {
      BluzelleHelper._cache.set(this.getItemHash(key), JSON.parse(value));
      return JSON.parse(value);
    });

    BluzelleHelper._cache.set(this.getLishHash(), data);
    return data;
  }

  async create(key: string, item: T): Promise<string | undefined> {
    const api = await this.getBluzelle();
    await api.create(key, JSON.stringify(item), BluzelleHelper.gasPrice);
    BluzelleHelper._cache.del(this.getItemHash(key));
    BluzelleHelper._cache.del(this.getLishHash());
    return key;
  }

  async insert(item: T): Promise<string | undefined> {
    const key = await this.create(uuidv4(), item);
    if (key === undefined) throw "Cant create an element";
    BluzelleHelper._cache.set(this.getItemHash(key), item);
    BluzelleHelper._cache.del(this.getLishHash());
    return key;
  }

  async update(key: string, item: T): Promise<void> {
    const api = await this.getBluzelle();
    await api.update(key, JSON.stringify(item), BluzelleHelper.gasPrice);
    BluzelleHelper._cache.set(this.getItemHash(key), item);
    BluzelleHelper._cache.del(this.getLishHash());
  }

  private async getBluzelle(): Promise<API> {
    if (this._api === undefined) {
      this._api = await bluzelle(this._config);

      if (this._api === undefined) {
        throw "Wrong mnemonic";
      }

      const account = await this._api.account();

      if (account.address === "") {
        throw "Wrong mnemonic";
      }
    }

    return this._api;
  }

  private getLishHash(): string {
    return this.uuid + "!LIST";
  }

  private getItemHash(key: string): string {
    return this.uuid + "@" + key;
  }
}
