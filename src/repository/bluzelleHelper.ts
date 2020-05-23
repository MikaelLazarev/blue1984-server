import { bluzelle, API } from "bluzelle";
import { v4 as uuidv4 } from "uuid";
import { GasInfo } from "bluzelle/lib/GasInfo";
import { BluzelleConfig } from "bluzelle/lib/BluzelleConfig";
import NodeCache from "node-cache";

export class BluzelleHelper<T> {
  private static _globalConfig: BluzelleConfig;
  private static _cache = new NodeCache({ deleteOnExpire: true, stdTTL: 100 });
  private _config: BluzelleConfig;
  private _api: API;
  private static gasPrice: GasInfo = {
    gas_price: 10,
  };

  constructor(uuid: string) {
    this._config = BluzelleHelper._globalConfig;
    this._config.uuid = uuid;
  }

  static set globalConfig(value: BluzelleConfig) {
    this._globalConfig = value;
  }

  get uuid() {
    return this._config.uuid;
  }

  findOne(id: string): Promise<T | undefined> {
    return new Promise<T | undefined>(async (resolve, reject) => {
      try {
        if (BluzelleHelper._cache.has(this.getItemHash(id))) {
          return resolve(BluzelleHelper._cache.get<T>(this.getItemHash(id)));
        }
        const api = await this.getBluzelle();
        const has = await api.has(id)
        if (!has) {
          resolve(undefined);
        }
        const dataStr = await api.read(id);
        resolve(JSON.parse(dataStr));
      } catch (e) {
        reject(e);
      }
    });
  }

  list(): Promise<T[] | undefined> {
    return new Promise<T[] | undefined>(async (resolve, reject) => {
      try {
        if (BluzelleHelper._cache.has(this.getLishHash())) {
          return resolve(BluzelleHelper._cache.get<T[]>(this.getLishHash()));
        }

        const api = await this.getBluzelle();

        const dataStr = await api.keyValues();
        const data = dataStr.map(({ key, value }) => {
          BluzelleHelper._cache.set(this.getItemHash(key), value);
          return JSON.parse(value);
        });

        BluzelleHelper._cache.set(this.getLishHash(), data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }

  create(key: string, item: T): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      const api = await this.getBluzelle();
      await api.create(key, JSON.stringify(item), BluzelleHelper.gasPrice);
      BluzelleHelper._cache.set(this.getItemHash(key), item);
      BluzelleHelper._cache.del(this.getLishHash());
      resolve(key);
    });
  }

  insert(item: T): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      const key = await this.create(uuidv4(), item);
      if (key === undefined) throw "Cant create an element";
      BluzelleHelper._cache.set(this.getItemHash(key), item);
      BluzelleHelper._cache.del(this.getLishHash());
    });
  }

  update(key: string, item: T): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const api = await this.getBluzelle();
        await api.update(key, JSON.stringify(item), BluzelleHelper.gasPrice);
        BluzelleHelper._cache.set(this.getItemHash(key), item);
        BluzelleHelper._cache.del(this.getLishHash());
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private getBluzelle(): Promise<API> {
    return new Promise<API>(async (resolve, reject) => {
      try {
        if (this._api === undefined) {
          this._api = await bluzelle(this._config);

          if (this._api === undefined) {
            reject("Wrong mnemonic");
          }

          const account = await this._api.account();

          if (account.address === "") {
            reject("Wrong mnemonic");
          }
        }

        resolve(this._api);
      } catch (e) {
        reject(e);
      }
    });
  }

  private getLishHash(): string {
    return this.uuid + "!LIST";
  }

  private getItemHash(key: string): string {
    return this.uuid + "@" + key;
  }
}
