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


