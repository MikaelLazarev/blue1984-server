import {Tweet} from "../../../src/core/tweet";

export interface Account {
  id: string;
  bluID: string;
  deleted?: number;
  changed?: number;
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

  tweets?: Tweet[];
}

export interface AccountCreateDTO {
  id: string;
}
