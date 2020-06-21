import {
  Account,
  AccountCreateDTO,
  AccountFull,
  AccountListDTO,
  AccountsRepositoryI,
  AccountsServiceI,
  TwitterProfileDTO,
} from "../core/accounts";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import {
  Tweet,
  tweetComparator,
  TweetsFull,
  TweetsRepositoryI,
  TweetsServiceI,
} from "../core/tweet";
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosInstance } from "axios";
import config from "../config/config";
import { Logger, getLogger } from 'log4js'

@injectable()
export class AccountsService implements AccountsServiceI {
  private _repository: AccountsRepositoryI;
  private _tweetsRepository: TweetsRepositoryI;
  private _tweetsService: TweetsServiceI;
  private _updater: NodeJS.Timeout;
  private _axiosInstance: AxiosInstance;
  private _logger: Logger;

  public constructor(
    @inject(TYPES.AccountsRepository) repository: AccountsRepositoryI,
    @inject(TYPES.TweetsService) tweetsService: TweetsServiceI,
    @inject(TYPES.TweetsRepository) tweetsRepository: TweetsRepositoryI
  ) {
    this._repository = repository;
    this._tweetsService = tweetsService;
    this._tweetsRepository = tweetsRepository;
    this._axiosInstance = axios.create({
      baseURL: config.scrapper,
      timeout: 100000,
      headers: { Authorization: "Basic " + config.scrapper_token },
    });
    this._logger = getLogger();
    this._logger.level = 'debug';

    this.startUpdate();
  }

  async create(dto: AccountCreateDTO): Promise<AccountCreateDTO | undefined> {
    const id = dto.id.startsWith("@") ? dto.id.substr(1) : dto.id;
    console.log(id);

    try {
      const profile: TwitterProfileDTO = await this.getUserProfile(id);
      const newAccount: Account = {
        id,
        bluID: uuidv4(),
        ...profile,
      };

      await this._repository.create(newAccount);
      return { id };
    } catch (e) {
      throw `Account ${id} was not found in Twitter database. \nPlease check it!`;
    }
  }

  async getUserProfile(account: string): Promise<TwitterProfileDTO> {
    const response = await this._axiosInstance.get<TwitterProfileDTO>(
      "/profile/" + account
    );
    if (response === undefined) throw "Cant get account";
    if (response.status === 404) throw "Account not found";
    this._logger.debug("GOT", response.data);
    return response.data;
  }

  async getUserTimeline(account: string): Promise<Tweet[]> {
    const response = await this._axiosInstance.get<Tweet[]>(
      "/timeline/" + account
    );
    if (response === undefined) throw "Cant get timeline for " + account;
    this._logger.debug(response.data);
    return response.data;
  }

  async list(dto: AccountListDTO): Promise<Account[] | undefined> {
    const data = await this._repository.list();

    this._logger.debug("ALL ACCOUNTS", data);
    const accountsMap = new Map<string, boolean>();
    dto.accounts.forEach((e) => accountsMap.set(e, true));
    this._logger.debug(accountsMap);
    return data?.filter((e) => accountsMap.has(e.id));
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
    this._updater = setTimeout(() => this.update(), 1000);
  }

  stopUpdate(): void {
    if (this._updater) {
      clearTimeout(this._updater);
    }
  }

  async update() {
    this._logger.info("Stating updates...")
    const accounts = await this._repository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, cause accounts are empty");
    } else {
      this._logger.info(`Got ${accounts.length} account for updating.`)
      for (let acc of accounts) {
        await this.updateAccount(acc);
      }
    }

    this._logger.info(`Update finished, next in ${config.updateDelay} sec`)
    this._updater = setTimeout(
      async () => await this.update(),
      config.updateDelay * 1000
    );
  }

  private async updateAccount(acc: Account): Promise<void> {
    this._logger.info("Updating account " + acc.id);
    let originalTweets: Tweet[] = [];
    try {
      originalTweets = await this.getUserTimeline(acc.id);
    } catch (e) {
      this._logger.error("Cant get tweets" + e)
      return
    }

    this._logger.debug(`Got ${originalTweets.length} from scrapper`)

    const updated = await this._tweetsService.update(
      acc.id,
      acc.bluID,
      originalTweets
    );

    const tweets = (await this._tweetsRepository.list(acc.bluID)) || [];
    const lastCached =
      tweets.length === 0 ? "-" : tweets.sort(tweetComparator)[0].time;

    const deleted = tweets.filter((e) => e.wasDeleted).length;

    // Got last data from profile
    const profile: TwitterProfileDTO = await this.getUserProfile(acc.id);
    const newAccount: Account = {
      ...acc,
      ...profile,
      deleted,
      lastCached,
      cached: tweets.length,
    };

    await this._repository.update(newAccount);

    this._logger.info(`Updated ${updated} tweets for ${acc.id}`);
  }
}
