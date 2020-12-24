import {API, bluzelle, BluzelleConfig} from "bluzelle";

export interface GasInfo {
  gas_price: number;
}

export class BluzelleAPI {
  private static _account: string;
  private static _amount: string;

  private static _config: BluzelleConfig;

  private static _gasPrice: GasInfo = {
    gas_price: 10,
  };

  static async getBluzelle(uuid: string): Promise<API> {

    const config = {
      ...BluzelleAPI._config,
      uuid,
    }
    const api = await bluzelle(config);
    console.log(api.address)
    if (api === undefined) {
      throw "Wrong mnemonic ";
    }


    const account = await api.account();
    console.log("ACCOUNT", account);

    if (account.address === "") {
      throw "Wrong mnemonic";
    }

    BluzelleAPI._account = account.address;
    BluzelleAPI._amount =
      account.coins.length > 0 ? account.coins[0].amount : "ZERO";

    console.log("Amount: ", BluzelleAPI._amount);

    return api;
  }

  static get account(): string {
    return this._account;
  }

  static async getAccount(): Promise<string> {
    await this.getBluzelle("test");
    return this._account;
  }

  static get amount(): string {
    return this._amount;
  }

  static get gasPrice(): GasInfo {
    return this._gasPrice;
  }

  static set globalConfig(config: BluzelleConfig) {
    BluzelleAPI._config = { ...config };
  }
}
