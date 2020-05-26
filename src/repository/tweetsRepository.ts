import { Tweet, TweetsRepositoryI } from "../core/tweet";
import { injectable } from "inversify";
import { BluzelleHelper } from "./bluzelleHelper";

@injectable()
export class TweetsRepository implements TweetsRepositoryI {

  async findOne(bluID: string, id: string): Promise<Tweet | undefined> {
    const bluAPI = new BluzelleHelper<Tweet>(bluID);
    return await bluAPI.findOne(id);
  }

  async list(bluID: string): Promise<Tweet[] | undefined> {
    const bluAPI = new BluzelleHelper<Tweet>(bluID);
    return await bluAPI.list();
  }

  async create(bluID: string, item: Tweet): Promise<string | undefined> {
    const bluAPI = new BluzelleHelper<Tweet>(bluID);
    return await bluAPI.create(item.id, item);
  }

  async update(bluID: string, item: Tweet): Promise<void> {
    const bluAPI = new BluzelleHelper<Tweet>(bluID);
    return await bluAPI.update(item.id, item);
  }
}
