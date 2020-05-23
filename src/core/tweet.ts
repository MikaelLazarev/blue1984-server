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
}

export interface TweetsRepositoryI {
  create(bluID: string, item: Tweet): Promise<string | undefined>;
  list(bluID: string): Promise<Tweet[] | undefined>;
  update(bluID: string, item: Tweet): Promise<void>;
}

export interface TweetsServiceI {
  list(id: string): Promise<Tweet[] | undefined>;
  update(twitterID: string, blueID: string): Promise<void>;
}
