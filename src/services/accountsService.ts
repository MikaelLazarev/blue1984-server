import {
  Account,
  AccountCreateDTO,
  AccountFull,
  AccountListDTO,
  AccountsRepositoryI,
  AccountsServiceI,
} from "../core/accounts";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { TweetsRepositoryI, TweetsServiceI } from "../core/tweet";

@injectable()
export class AccountsService implements AccountsServiceI {
  private _repository: AccountsRepositoryI;
  private _tweetsRepository: TweetsRepositoryI;
  private _tweetsService: TweetsServiceI;
  private _updater: NodeJS.Timeout;

  public constructor(
    @inject(TYPES.AccountsRepository) repository: AccountsRepositoryI,
    @inject(TYPES.TweetsService) tweetsService: TweetsServiceI,
    @inject(TYPES.TweetsRepository) tweetsRepository: TweetsRepositoryI
  ) {
    this._repository = repository;
    this._tweetsService = tweetsService;
    this._tweetsRepository = tweetsRepository;
  }

  create(dto: AccountCreateDTO): Promise<Account | undefined> {
    return this._repository.create(dto.id);
  }

  async list(dto: AccountListDTO): Promise<Account[] | undefined> {
    const data = await this._repository.list();

    console.log(data);
    const accountsMap = new Map<string, boolean>();
    dto.accounts.forEach((e) => accountsMap.set(e, true));
    console.log(accountsMap);
    return data?.filter((e) => accountsMap.has(e.id));
  }

  async retrieve(id: string): Promise<AccountFull> {
    const account = await this._repository.findOne(id);
    console.log("ACCOUNT", account)
    if (account === undefined) throw "This account is not registered in system";
    const tweets = await this._tweetsRepository.list(account.bluID);
    return {
      ...account,
      tweets: tweets || [],
    };
  }

  startUpdate(): void {
    this._updater = setInterval(() => this.update(), 10000);
  }

  stopUpdate(): void {
    if (this._updater) {
      clearTimeout(this._updater);
    }
  }

  async update() {
    console.log("UPDDD!");
    const accounts = await this._repository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, account = undefined");
      return;
    }

    for (let acc of accounts) {
      await this._tweetsService.update(acc.id, acc.bluID);
    }
  }
}
