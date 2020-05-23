import { Tweet, TweetsRepositoryI } from "../core/tweet";
import { injectable } from "inversify";
import {BluzelleHelper} from "./bluzelleHelper";

@injectable()
export class TweetsRepository implements TweetsRepositoryI {
  constructor() {
    super(Tweet);
  }

  list(bluID: string): Promise<Tweet[] | undefined> {
    return new Promise<Tweet[]|undefined>(async(resolve, reject) => {
      const bluAPI = new BluzelleHelper<Tweet>(bluID)
      const result = await bluAPI.list();

        }
    )

  }
}
