import {Tweet} from "./tweet";
import {TwitterProfileDTO} from "../payloads/twitter";

export interface TwitterRepositoryI {
    getUserInfo(id: string) : Promise<TwitterProfileDTO>
    getUserTimeline(account: string): Promise<Tweet[]>
}
