import {Tweet, TweetsRepositoryI} from "../core/tweet";
import {KvCachedDB} from "./kvCachedDB";
import {Container, Service} from "typedi";
import {BluzelleDBManager} from "./bluzelleDB";
import {KeyValueDBManager} from "../core/keyValueDB";
import {MemDBManager} from "./memDB";
import {ConfigService} from "../config";

@Service()
export class TweetsRepository implements TweetsRepositoryI
{
  private readonly _dbManager: KeyValueDBManager;

  constructor() {
    const config = Container.get(ConfigService);
    this._dbManager =
        config.dbType === "MEM"
            ? Container.get(MemDBManager)
            : Container.get(BluzelleDBManager);
  }

  async findOne(bluID: string, id: string): Promise<Tweet | undefined> {
    const bluAPI = new KvCachedDB<Tweet>(this._dbManager, bluID);
    return await bluAPI.findOne(id);
  }

  async list(bluID: string): Promise<Tweet[] | undefined> {
    const bluAPI = new KvCachedDB<Tweet>(this._dbManager, bluID);
    return await bluAPI.list();
  }

  async create(bluID: string, item: Tweet): Promise<string | undefined> {
    const bluAPI = new KvCachedDB<Tweet>(this._dbManager, bluID);
    return await bluAPI.create(item.id, item);
  }

  async update(bluID: string, item: Tweet): Promise<void> {
    const bluAPI = new KvCachedDB<Tweet>(this._dbManager, bluID);
    return await bluAPI.update(item.id, item);
  }
}
