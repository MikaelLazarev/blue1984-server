export class TwitterProfileDTO {
  id: string;
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
}
