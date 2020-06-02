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

// @ts-ignore
import { v4 as uuidv4 } from "uuid";
import axios, { AxiosInstance } from "axios";
import config from "../config/config";

@injectable()
export class AccountsService implements AccountsServiceI {
  private _repository: AccountsRepositoryI;
  private _tweetsRepository: TweetsRepositoryI;
  private _tweetsService: TweetsServiceI;
  private _updater: NodeJS.Timeout;
  private _axiosInstance: AxiosInstance;

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
    this.startUpdate();
  }

  async create(dto: AccountCreateDTO): Promise<Account[] | undefined> {
    try {
      const profile: TwitterProfileDTO = await this.getUserProfile(dto.id);
      const newAccount: Account = {
        id: dto.id,
        bluID: uuidv4(),
        ...profile,
      };

      await this._repository.create(newAccount);
      return await this.list({accounts: dto.list || []})
    }
    catch (e) {
      throw `Account ${dto.id} was not found in Twitter database. \nPlease check it!`
  }
  }

  async getUserProfile(account: string): Promise<TwitterProfileDTO> {
    const response = await this._axiosInstance.get<TwitterProfileDTO>(
      "/profile/" + account
    );
    if (response === undefined) throw "Cant get account";
    if (response.status === 404) throw "Account not found";
    console.log("GOT", response);
    return response.data;
  }

  async getUserTimeline(account: string): Promise<Tweet[]> {
    const response = await this._axiosInstance.get<Tweet[]>(
        "/timeline/" + account
    );
    if (response === undefined) throw "Cant get timeline for " + account;
    console.log(response);
    return response.data;
  }


  async list(dto: AccountListDTO): Promise<Account[] | undefined> {
    const data = await this._repository.list();

    console.log("ALL ACCOUNTS", data);
    const accountsMap = new Map<string, boolean>();
    dto.accounts.forEach((e) => accountsMap.set(e, true));
    console.log(accountsMap);
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
    console.log("UPDDD!");
    const accounts = await this._repository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, account = undefined");
      return;
    }


    for (let acc of accounts) {
      const originalTweets = await this.getUserTimeline(acc.id);
      const updated = await this._tweetsService.update(acc.id, acc.bluID, originalTweets);

      const tweets = (await this._tweetsRepository.list(acc.bluID)) || [];
      const changed = tweets.filter((e) => e.wasChanged).length;
      const lastCached =
        tweets.length === 0 ? "-" : tweets.sort(tweetComparator)[0].time;

      const deleted = tweets.filter((e) => e.wasDeleted).length;

      console.log("SIZE:::", tweets.length);

      // Got last data from profile
      const profile: TwitterProfileDTO = await this.getUserProfile(acc.id);
      const newAccount: Account = {
        ...acc,
        ...profile,
        changed,
        deleted,
        lastCached,
        cached: tweets.length,
      };

      await this._repository.update(newAccount);

      console.log(`Updated ${updated} tweets for ${acc.id}`);
    }
    this._updater = setTimeout(() => this.update(), 100000);
  }
}
