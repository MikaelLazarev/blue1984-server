export interface Tweet {}

export interface TweetsRepositoryI {
  list(bluID: string): Promise<Tweet[] | undefined>;
}

export interface TweetsServiceI {
    list(id: string): Promise<Tweet[] | undefined>;
}
