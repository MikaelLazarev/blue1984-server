import { IsNotEmpty } from "class-validator";
import { Account } from "./accounts";
import { AccountListDTO } from "../payloads/accounts";
import { FeedQuery, TweetsListDTO } from "../payloads/tweets";
import { TwitterAccount } from "./twitter";

export interface TweetURL {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
}

export class TweetMedia {
  media_key: string;
  type: string;
  url: string;
}

export class Mention {
  start: number;
  end: number;
  username: string;
}

export class HashTag {
  start: number;
  end: number;
  tag: number;
}

export class Tweet {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  created_at: Date;

  entities: {
    mentions: Array<Mention>;
    urls: Array<TweetURL>;
    hashtags: Array<HashTag>;
  };

  @IsNotEmpty()
  author_id: string;

  author?: TwitterAccount;

  media: Array<TweetMedia>;

  wasDeleted: boolean;

  attachments: {
    media_keys: Array<string>;
  };
}

export function tweetComparator(a: Tweet, b: Tweet): number {
  if (a.created_at > b.created_at) return -1;
  return 1;
}

export interface TweetsRepositoryI {
  findOne(bluID: string, id: string): Promise<Tweet | undefined>;
  create(bluID: string, item: Tweet): Promise<string | undefined>;
  list(bluID: string): Promise<Tweet[] | undefined>;
  update(bluID: string, item: Tweet): Promise<void>;
}

export interface TweetsServiceI {
  feed(dto: AccountListDTO, query: FeedQuery): Promise<TweetsListDTO>;
  update(account: Account): Promise<void>;
}
