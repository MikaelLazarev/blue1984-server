import {Tweet} from "./tweet";
import {TwitterProfileDTO} from "../payloads/twitterPayload";

export class TwitterAccount {
    id: string;
    username: string;
    name: string;
    profile_image_url?: string;
    description: string;

}


export interface TwitterRepositoryI {
    getUserInfo(id: string) : Promise<TwitterProfileDTO>
    getUserTimeline(account: string): Promise<Tweet[]>
}
