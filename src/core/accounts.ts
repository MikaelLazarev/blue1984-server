import {Tweet, TweetsFull} from "./tweet";
import {IsNotEmpty} from "class-validator";

export interface Account {
  id: string;
  bluID: string;
  deleted?: number;
  cached?: number;
  lastCached?: number;

  screenName: string;
  profileImage: string;
  backgroundImage: string;

  name: string;
  bio: string;
  userMentions: string[];
  hashtags: string[];
  urls: [];
  location: string;
  url: string;
  joinDate: string;
  tweetCount: number;
  followingCount: number;
  followerCount: number;
  likeCount: number;
}


export interface AccountFull {
  id: string;
  bluID: string;
  tweets: TweetsFull[];
}

export class AccountCreateDTO {
  @IsNotEmpty()
  id: string;

  list?: string[];
}


export class AccountListDTO {
  @IsNotEmpty()
  accounts: string[];
}

export interface AccountsRepositoryI {
  create(dto: AccountCreateDTO): Promise<Account | undefined>;
  update(newAccount: Account): Promise<void>;
  findOne(id: string): Promise<Account | undefined>;
  list(): Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(dto: AccountCreateDTO): Promise<AccountCreateDTO| undefined>;
  list(dto: AccountListDTO): Promise<Account[] | undefined>;
  feed(dto: AccountListDTO) : Promise<Tweet[] | undefined>
  retrieve(id: string): Promise<AccountFull>;
  startUpdate(): void;
  stopUpdate(): void;
}
