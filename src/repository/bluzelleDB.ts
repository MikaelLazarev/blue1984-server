import { API, bluzelle, BluzelleConfig, mnemonicToAddress } from "bluzelle";
import {
  BluzelleInternalError,
  WrongMnemonicError,
} from "../errors/bluzelleErrors";
import { KeyValue, KeyValueDB, KeyValueDBManager } from "../core/keyValueDB";
import { Container, Service } from "typedi";
import { ConfigService } from "../config";

@Service()
export class BluzelleDBManager implements KeyValueDBManager {
  private readonly _config: BluzelleConfig;

  constructor() {
    const config = Container.get(ConfigService);
    this._config = {
      mnemonic: config.bluzelle_mnemonic,
      uuid: "",
      endpoint: config.bluzelle_endpoint,
    };
  }

  async get(uuid: string): Promise<KeyValueDB> {
    const api = await bluzelle({
      ...this._config,
      uuid,
    });
    if (api === undefined) throw new BluzelleInternalError();
    console.log("ACCOUNT", await api.account())

    return new BluzelleDB(api);
  }

  get address(): string {
    const { mnemonic } = this._config;
    const address = mnemonicToAddress(mnemonic);
    if (address === "") {
      throw new WrongMnemonicError(mnemonic);
    }
    return address;
  }
}

export interface GasInfo {
  gas_price: number;
  max_gas: number;
}

export class BluzelleDB implements KeyValueDB {
  private static _gasPrice: GasInfo = {gas_price: 0.002, max_gas: 10000000}

  private readonly _api: API;

  constructor(api: API) {
    this._api = api;
  }

  has(key: string): Promise<boolean> {
    return this._api.has(key);
  }

  read(key: string): Promise<string> {
    return this._api.read(key);
  }

  keyValues(): Promise<Array<KeyValue>> {
    return this._api.keyValues();
  }

  count(): Promise<number> {
    return this._api.count();
  }

  async create(key: string, value: string) {
    await this._api.create(key, value, BluzelleDB.gasPrice);
  }

  async update(key: string, value: string) {
    await this._api.update(key, value, BluzelleDB.gasPrice);
  }

  async delete(key: string) {
    await this._api.delete(key, BluzelleDB.gasPrice);
  }

  async getAmount(): Promise<string> {
    const account = await this._api.account();
    return account.coins.length > 0 ? account.coins[0].amount : "ZERO";
  }

  static get gasPrice(): GasInfo {
    return this._gasPrice;
  }
}
