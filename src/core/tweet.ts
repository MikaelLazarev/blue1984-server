export interface Tweet {
  id: string;
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
