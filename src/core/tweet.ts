interface URL {
  indices: number[];
  url: string;
}
interface User {
  avatar: string,
  nickname: string,
  name: string,
}


export class Tweet {
  id: string;
  screenName: string;
  text: string;
  time: number;
  isPinned: boolean;
  isReplyTo: boolean;
  isRetweet: boolean;
  urls: URL[];
  hashtags: string[];
  images: string[];
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

