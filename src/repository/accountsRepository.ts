import { Account, AccountsRepositoryI } from "../core/accounts";
import { KvCachedDB } from "./kvCachedDB";
import { Container, Service } from "typedi";
import { ConfigService } from "../config";
import { KeyValueDBManager } from "../core/keyValueDB";
import { BluzelleDBManager } from "./bluzelleDB";
import { MemDBManager } from "./memDB";

@Service()
export class AccountsRepository implements AccountsRepositoryI {
  private readonly _db: KvCachedDB<Account>;
  private readonly _dbManager: KeyValueDBManager;

  constructor() {
    const config = Container.get(ConfigService);
    this._dbManager =
      config.dbType === "MEM"
        ? Container.get(MemDBManager)
        : Container.get(BluzelleDBManager);
    this._db = new KvCachedDB<Account>(this._dbManager, config.mainDB);
  }

  async getOrCreate(newAccount: Account): Promise<Account> {
    const existingAcc = await this._db.findOne(newAccount.id);
    console.log("FOUND NEXT", existingAcc);

    if (existingAcc !== undefined) return existingAcc;

    await this._db.create(newAccount.id, newAccount);
    return newAccount;
  }

  update(newAccount: Account): Promise<void> {
    return this._db.update(newAccount.id, newAccount);
  }

  findOne(id: string): Promise<Account | undefined> {
    return this._db.findOne(id);
  }

  list(): Promise<Account[] | undefined> {
    return this._db.list();
  }
}
