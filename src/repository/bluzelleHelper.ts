import { bluzelle, API } from "bluzelle";
import { v4 as uuidv4 } from "uuid";
import { GasInfo } from "bluzelle/lib/GasInfo";
import { BluzelleConfig } from "bluzelle/lib/BluzelleConfig";

export class BluzelleHelper<T> {
  private static _globalConfig: BluzelleConfig;
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

  findOne(id: string): Promise<T | undefined> {
    return new Promise<T | undefined>(async (resolve, reject) => {
      try {
        const api = await this.getBluzelle();
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
        const api = await this.getBluzelle();
        const dataStr = await api.keyValues();
        resolve(
          dataStr.map(({ key, value }) => {
            return JSON.parse(value);
          })
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  create(key: string, item: T): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      const api = await this.getBluzelle();
      await api.create(key, JSON.stringify(item), BluzelleHelper.gasPrice);
      resolve(key);
    });
  }

  insert(item: T): Promise<string | undefined> {
    return this.create(uuidv4(), item);
  }

  update(id: string, item: T): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const api = await this.getBluzelle();
        await api.update(id, JSON.stringify(item), BluzelleHelper.gasPrice);
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
          const api = await bluzelle(this._config);

          const account = await api.account();

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
}
