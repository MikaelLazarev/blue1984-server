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
import { getUserProfile } from "scrape-twitter";
import { v4 as uuidv4 } from "uuid";

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
    this.startUpdate();
  }

  async create(dto: AccountCreateDTO): Promise<Account | undefined> {
    const profile: TwitterProfileDTO = await getUserProfile(dto.id);
    const newAccount: Account = {
      id: dto.id,
      bluID: uuidv4(),
      ...profile,
    };

    return await this._repository.create(newAccount);
  }

  async list(dto: AccountListDTO): Promise<Account[] | undefined> {
    const data = await this._repository.list();

    console.log(data);
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
      const updated = await this._tweetsService.update(acc.id, acc.bluID);

      const tweets = (await this._tweetsRepository.list(acc.bluID)) || [];
      const changed = tweets.filter((e) => e.wasChanged).length;
      const lastCached =
        tweets.length === 0 ? "-" : tweets.sort(tweetComparator)[0].time;

      const deleted = tweets.filter((e) => e.wasDeleted).length;

      console.log("SIZE:::", tweets.length);

      // Got last data from profile
      const profile: TwitterProfileDTO = await getUserProfile(acc.id);
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
