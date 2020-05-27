interface URL {
  indices: number[];
  url: string;
}
interface User {
  avatar: string,
  nickname: string,
  name: string,
}


export interface Tweet {
  id: string;
  screenName: string;
  text: string;
  time: string;
  isPinned: boolean;
  isReplyTo: boolean;
  isRetweet: boolean;
  urls: URL[];
  hashtags: string[];
  images: string[];
  favoriteCount: number;
  replyCount: number;
  retweetCount: number;
  wasChanged: boolean;
  wasDeleted: boolean;
}

export interface TweetsFull extends Tweet{
  user?: User;
}

function check<T>(name: string, a: T, b: T): boolean {
  if (a !== b) {
    console.log(`${name} changed ${a} != ${b} `);
    return true;
  }
  return false;
}

export function isEqual(a: Tweet, b: Tweet): boolean {
  if (
    check("screen name", a.screenName, b.screenName) ||
    check("text", a.text, b.text) ||
    check("time", a.time, b.time) ||
    check("urls", JSON.stringify(a.urls), JSON.stringify(b.urls)) ||
    check("hashtags", JSON.stringify(a.hashtags), JSON.stringify(b.hashtags)) ||
    check("images", JSON.stringify(a.images), JSON.stringify(b.images))
  ) {
    return false;
  }
  return true;
}

export function tweetComparator(a: Tweet, b: Tweet): number {
  if (a.time > b.time) return -1;
  return 1;
}

export interface TweetsRepositoryI {
  findOne(bluID: string, id: string): Promise<Tweet | undefined>;
  create(bluID: string, item: Tweet): Promise<string | undefined>;
  list(bluID: string): Promise<Tweet[] | undefined>;
  update(bluID: string, item: Tweet): Promise<void>;
}

export interface TweetsServiceI {
  retrieve(bluID: string, id: string): Promise<Tweet | undefined>;
  update(twitterID: string, blueID: string): Promise<number>;
}
