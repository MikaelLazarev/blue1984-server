import {
  Account,
  AccountCreateDTO,
  AccountFull,
  AccountListDTO,
  AccountsServiceI,
} from "../core/accounts";
import { Tweet, tweetComparator, TweetsFull } from "../core/tweet";
import { v4 as uuidv4 } from "uuid";
import { getLogger, Logger } from "log4js";
import { Container, Inject, Service } from "typedi";
import { ConfigService } from "../config";
import { AccountsRepository } from "../repository/accountsRepository";
import { TweetsRepository } from "../repository/tweetsRepository";
import { TweetsService } from "./tweetsService";
import { TwitterRepository } from "../repository/twitterRepository";
import { AccountDoesntExistError } from "../errors/accountsError";

@Service()
export class AccountsService implements AccountsServiceI {
  @Inject()
  private _repository: AccountsRepository;

  @Inject()
  private _tweetsRepository: TweetsRepository;

  @Inject()
  private _tweetsService: TweetsService;

  @Inject()
  private _twitterRepository: TwitterRepository;

  private readonly _updateDelay: number;

  private _updater: NodeJS.Timeout;

  private _logger: Logger;

  constructor() {
    this._logger = getLogger();
    this._logger.level = "debug";
    this._updateDelay = Container.get(ConfigService).updateDelay;
    this.startUpdate();
  }

  async create(dto: AccountCreateDTO): Promise<AccountCreateDTO | undefined> {
    const id = dto.id.startsWith("@") ? dto.id.substr(1) : dto.id;
    console.log(id);

    try {
      const profile = await this._twitterRepository.getUserInfo(id);
      const newAccount: Account = {
        bluID: uuidv4(),
        ...profile,
        id
      };

      console.log(newAccount);
      // await this._repository.create(newAccount);
      console.log(await this._twitterRepository.getUserTimeline(profile.id));
      // this.startUpdate();
      return { id };
    } catch (e) {
      console.log(e);
      throw new AccountDoesntExistError(id);
    }
  }

  async list(dto: AccountListDTO): Promise<Account[] | undefined> {
    const data = await this._repository.list();

    this._logger.debug("ALL ACCOUNTS", data);
    const accountsMap = new Map<string, boolean>();
    dto.accounts.forEach((e) => accountsMap.set(e, true));
    const userRequestedAccounts = data?.filter((e) => accountsMap.has(e.id));
    const result: Account[] = [];
    for (let acc of userRequestedAccounts || []) {
      result.push(await this.enrichAccountInfo(acc));
    }
    return result;
  }

  async feed(dto: AccountListDTO): Promise<Tweet[] | undefined> {
    const accounts = await this.list(dto);
    const result: Tweet[] = [];
    if (accounts === undefined) return;
    for (let acc of accounts) {
      const accFull = (await this.retrieve(acc.id)) || [];
      accFull.tweets.map((t) => result.push(t));
    }

    return result.sort(tweetComparator);
  }

  async retrieve(id: string): Promise<AccountFull> {
    const account = await this._repository.findOne(id);
    console.log("ACCOUNT", account);
    if (account === undefined) throw "This account is not registered in system";
    const tweets = (await this._tweetsRepository.list(account.bluID)) || [];

    const tweetsFull: TweetsFull[] = tweets.map((e) => ({
      ...e,
      user: {
        name: account.name,
        avatar: account.profileImage,
        nickname: e.screenName,
      },
    }));

    return {
      ...account,
      tweets: tweetsFull.sort(tweetComparator),
    };
  }

  startUpdate(): void {
    this.stopUpdate();
    this._updater = setTimeout(() => this.update(), 1000);
  }

  stopUpdate(): void {
    if (this._updater) {
      clearTimeout(this._updater);
    }
  }

  async update() {
    this._logger.info("Stating updates...");
    const accounts = await this._repository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, cause accounts are empty");
    } else {
      this._logger.info(`Got ${accounts.length} account for updating.`);
      for (let acc of accounts) {
        await this.updateAccount(acc);
      }
    }

    this._logger.info(`Update finished, next in ${this._updateDelay} sec`);
    this._updater = setTimeout(
      async () => await this.update(),
      this._updateDelay * 1000
    );
  }

  private async updateAccount(acc: Account): Promise<void> {
    this._logger.info("Updating account " + acc.id);
    let originalTweets: Tweet[] = [];
    try {
      originalTweets = await this._twitterRepository.getUserTimeline(acc.id);
    } catch (e) {
      this._logger.error("Cant get tweets" + e);
      return;
    }

    this._logger.debug(`Got ${originalTweets.length} from twitter`);

    const updated = await this._tweetsService.update(
      acc.id,
      acc.bluID,
      originalTweets
    );

    // Got last data from profile
    try {
      const profile = await this._twitterRepository.getUserInfo(acc.id);
      const newAccount: Account = {
        ...acc,
        ...profile,
      };

      await this._repository.update(newAccount);

      this._logger.info(`Updated ${updated} tweets for ${acc.id}`);
    } catch (e) {
      this._logger.error("Error during updading account", e);
    }
  }

  private async enrichAccountInfo(account: Account): Promise<Account> {
    const tweets = (await this._tweetsRepository.list(account.bluID)) || [];
    const lastCached =
      tweets.length === 0 ? undefined : tweets.sort(tweetComparator)[0].time;

    const deleted = tweets.filter((e) => e.wasDeleted).length;

    return {
      ...account,
      deleted,
      lastCached,
      cached: tweets.length,
    };
  }
}
