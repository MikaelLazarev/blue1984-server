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
  user?: User;
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


