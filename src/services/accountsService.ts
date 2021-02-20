import {
  Account,
  AccountsRepositoryI,
  AccountsServiceI,
} from "../core/accounts";
import { v4 as uuidv4 } from "uuid";
import { getLogger, Logger } from "log4js";
import { Container, Service } from "typedi";
import { AccountsRepository } from "../repository/accountsRepository";
import { TwitterRepository } from "../repository/twitterRepository";
import {
  AccountDoesntExistError,
  AccountNotRegisteredError,
} from "../errors/accountsError";
import { TwitterRepositoryI } from "../core/twitter";
import { AccountCreateDTO, AccountListDTO } from "../payloads/accounts";
import { TweetsServiceI } from "../core/tweet";
import { TweetsService } from "./tweetsService";

@Service()
export class AccountsService implements AccountsServiceI {
  private readonly _repository: AccountsRepositoryI;
  private readonly _twitterRepository: TwitterRepositoryI;
  private _tweetsService: TweetsServiceI;

  private readonly _logger: Logger;

  constructor() {
    this._logger = getLogger();
    this._logger.level = "debug";

    this._repository = Container.get(AccountsRepository);
    this._twitterRepository = Container.get(TwitterRepository);
  }

  postInit() {
    this._tweetsService = Container.get(TweetsService);
  }

  create(dto: AccountCreateDTO): Promise<AccountCreateDTO | undefined> {
    return new Promise<AccountCreateDTO | undefined>(
      async (resolve, reject) => {
        let username = dto.id.startsWith("@") ? dto.id.substr(1) : dto.id;
        username = username.toLowerCase();

        try {
          const profile = await this._twitterRepository.getUserInfo(username);

          console.log("FOUND PROFILE", profile);
          let newAccount: Account = {
            bluID: uuidv4(),
            ...profile,
          };

          newAccount = await this._repository.getOrCreate(newAccount);
          // console.log(await this._twitterRepository.getUserTimeline(profile.id));
          // this.startUpdate();
          resolve({ id: profile.id });

          // Update data for new account
          await this._tweetsService.update(newAccount);
        } catch (e) {
          console.log(e);
          reject(new AccountDoesntExistError(username));
        }
      }
    );
  }

  async list(dto: AccountListDTO): Promise<Account[]> {
    const data = await this._repository.list();

    this._logger.debug("ALL ACCOUNTS", data);
    const accounts = dto.accounts.map((a) => a.toLowerCase());
    const userAccountsSet = new Set<string>(accounts);
    return data?.filter((e) => userAccountsSet.has(e.id)) || [];
  }

  async retrieve(id: string): Promise<Account> {
    const account = await this._repository.findOne(id);
    if (account === undefined) throw new AccountNotRegisteredError(id);
    return account;
  }

  async updateAccount(
    acc: Account,
    cached: number,
    deleted: number
  ): Promise<void> {
    this._logger.info("Updating account " + acc.id);

    // Got last data from profile
    try {
      const profile = await this._twitterRepository.getUserInfo(acc.username);

      const newAccount: Account = {
        ...acc,
        ...profile,
        cached,
        deleted,
      };

      await this._repository.update(newAccount);
    } catch (e) {
      this._logger.error("Error during updading account", e);
    }
  }
}
