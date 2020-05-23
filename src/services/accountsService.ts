import {
  Account, AccountCreateDTO,
  AccountsRepositoryI,
  AccountsServiceI,
} from "../core/accounts";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {TweetsServiceI} from "../core/tweet";

@injectable()
export class AccountsService implements AccountsServiceI {
  private _repository: AccountsRepositoryI;
  private _tweetsService : TweetsServiceI;
  private _updater : NodeJS.Timeout;

  public constructor(
    @inject(TYPES.AccountsRepository) repository: AccountsRepositoryI,
    @inject(TYPES.TweetsService) tweetsService: TweetsServiceI

  ) {
    this._repository = repository;
    this._tweetsService = tweetsService;
  }

  create(dto: AccountCreateDTO): Promise<Account | undefined> {
    return this._repository.create(dto.name);
  }

  list(): Promise<Account[] | undefined> {
    return this._repository.list();
  }

  startUpdate() : void{
    this._updater = setInterval(() => this.update(), 10000);

  }

  stopUpdate() : void {
    if (this._updater) {
       clearTimeout(this._updater);
    }

  }

  async update() {
    console.log("UPDDD!")
    const accounts = await this._repository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, account = undefined");
      return
    }

    for(let acc of accounts) {
      await this._tweetsService.update(acc.id, acc.bluID);
    }
  }

}

