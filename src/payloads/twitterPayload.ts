import {IsNotEmpty} from "class-validator";

export class TwitterProfileDTO {

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  name: string;

  description: string;


  // OLD
  profileImage: string;
  backgroundImage: string;

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
