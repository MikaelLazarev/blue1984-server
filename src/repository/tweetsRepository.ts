import { Tweet, TweetsRepositoryI } from "../core/tweet";
import { injectable } from "inversify";
import { BluzelleHelper } from "./bluzelleHelper";

@injectable()
export class TweetsRepository implements TweetsRepositoryI {

  findOne(bluID: string, id: string) : Promise<Tweet | undefined> {
    return new Promise<Tweet| undefined>(async (resolve, reject) => {
      try {
        const bluAPI = new BluzelleHelper<Tweet>(bluID);
        const result = await bluAPI.findOne(id)
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  list(bluID: string): Promise<Tweet[] | undefined> {
    return new Promise<Tweet[] | undefined>(async (resolve, reject) => {
      try {
        const bluAPI = new BluzelleHelper<Tweet>(bluID);
        const result = await bluAPI.list();
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  create(bluID: string, item: Tweet): Promise<string | undefined> {
    return new Promise<string | undefined>(async (resolve, reject) => {
      try {
        const bluAPI = new BluzelleHelper<Tweet>(bluID);
        const result = await bluAPI.insert(item)
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  }

  update(bluID: string, item: Tweet): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const bluAPI = new BluzelleHelper<Tweet>(bluID);
        await bluAPI.update(item.id, item)
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }



}
