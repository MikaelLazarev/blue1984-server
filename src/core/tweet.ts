interface URL {
  indices: number[];
  url: string;
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
}

export interface TweetsFeed {
  id: string;
  data: Tweet[];
}



export function isEqual(a: Tweet, b: Tweet) : boolean {
  if (a.screenName !== b.screenName ||
      a.text !== b.text ||
      a.time !== b.time ||
      a.urls !== b.urls ||
      a.hashtags !== b.hashtags ||
      a.images !== b.images) return false;
  return true;
}

export interface TweetsRepositoryI {
  findOne(bluID: string, id: string) : Promise<Tweet | undefined>;
  create(bluID: string, item: Tweet): Promise<string | undefined>;
  list(bluID: string): Promise<Tweet[] | undefined>;
  update(bluID: string, item: Tweet): Promise<void>;
}

export interface TweetsServiceI {
  retrieve(bluID: string, id: string)  : Promise<Tweet | undefined>;
  update(twitterID: string, blueID: string): Promise<void>;
}
