import { Account, AccountsRepositoryI } from "../core/accounts";
import { BluzelleHelper } from "./bluzelleHelper";
import { injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";

@injectable()
export class AccountsRepository implements AccountsRepositoryI {
  private _blu: BluzelleHelper<Account>;

  constructor() {
    this._blu = new BluzelleHelper<Account>("Blu1984");
  }

  create(id: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const newAccount: Account = {
          id,
          bluID: uuidv4(),
        };

        await this._blu.create(id, newAccount);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  findOne(id: string): Promise<Account | undefined> {
    return this._blu.findOne(id);
  }

  list(): Promise<Account[] | undefined> {
    return this._blu.list();
  }
}
