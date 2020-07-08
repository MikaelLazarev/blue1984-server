import { bluzelle, API } from "bluzelle";
import { injectable } from "inversify";
import { BluzelleConfig } from "bluzelle/lib/BluzelleConfig";
import { GasInfo } from "bluzelle/lib/GasInfo";

@injectable()
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
    console.log("GET BLUZELLE", config, uuid);
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

    return api;
  }

  static get account(): string {
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
