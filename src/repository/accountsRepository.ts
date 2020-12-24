import {Account, AccountsRepositoryI} from "../core/accounts";
import {BluzelleHelper} from "./bluzelleHelper";
import {Container, Service} from "typedi";
import {ConfigService} from "../config";

@Service()
export class AccountsRepository implements AccountsRepositoryI {
  private _blu: BluzelleHelper<Account>;

  constructor() {
    const config = Container.get(ConfigService);
    this._blu = new BluzelleHelper<Account>(config.mainDB);
  }

  async create(newAccount: Account): Promise<Account | undefined> {

    const existingAcc = await this._blu.findOne(newAccount.id);

    if (existingAcc !== undefined) {
      return existingAcc;
    }

    await this._blu.create(newAccount.id, newAccount);
    return newAccount;
  }

  update(newAccount: Account) : Promise<void> {
    return this._blu.update(newAccount.id, newAccount);
  }

  findOne(id: string): Promise<Account | undefined> {
    return this._blu.findOne(id);
  }

  list(): Promise<Account[] | undefined> {
    return this._blu.list();
  }
}
