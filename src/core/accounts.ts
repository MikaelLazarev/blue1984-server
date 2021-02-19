import { AccountCreateDTO, AccountListDTO } from "../payloads/accounts";
import {TwitterAccount} from "./twitter";



export interface Account extends TwitterAccount {
  bluID: string;
  deleted?: number;
  cached?: number;
  lastCached?: number;
}

export interface AccountsRepositoryI {
  getOrCreate(dto: AccountCreateDTO): Promise<Account | undefined>;
  update(newAccount: Account): Promise<void>;
  findOne(id: string): Promise<Account | undefined>;
  list(): Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(dto: AccountCreateDTO): Promise<AccountCreateDTO | undefined>;
  list(dto: AccountListDTO): Promise<Account[]>;
  retrieve(id: string): Promise<Account>;
  updateAccount(acc: Account, cached: number, deleted: number): Promise<void>;
}
