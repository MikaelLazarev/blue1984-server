import {Tweet, TweetsFull} from "./tweet";

export interface Account {
  id: string;
  bluID: string;
  changed?: number;
  deleted?: number;
  cached?: number;
  lastCached?: string;

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

export interface TwitterProfileDTO {
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

export interface AccountCreateDTO {
  id: string;
}

export const accountCreateDTOSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: {
      type: "string",
    },
  },
};

export interface AccountListDTO {
  accounts: string[];
}

export const accountListDTOSchema = {
  type: "object",
  required: ["accounts"],
  properties: {
    accounts: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
};

export interface AccountsRepositoryI {
  create(dto: AccountCreateDTO): Promise<Account | undefined>;
  update(newAccount: Account): Promise<void>;
  findOne(id: string): Promise<Account | undefined>;
  list(): Promise<Account[] | undefined>;
}

export interface AccountsServiceI {
  create(dto: AccountCreateDTO): Promise<Account | undefined>;
  list(dto: AccountListDTO): Promise<Account[] | undefined>;
  feed(dto: AccountListDTO) : Promise<Tweet[] | undefined>
  retrieve(id: string): Promise<AccountFull>;
  startUpdate(): void;
  stopUpdate(): void;
}
