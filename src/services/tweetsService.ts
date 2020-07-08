import { Tweet, TweetsRepositoryI, TweetsServiceI } from "../core/tweet";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { getLogger, Logger } from "log4js";

@injectable()
export class TweetsService implements TweetsServiceI {
  private _repository: TweetsRepositoryI;
  private _logger: Logger;

  public constructor(
    @inject(TYPES.TweetsRepository) repository: TweetsRepositoryI
  ) {
    this._repository = repository;
    this._logger = getLogger();
    this._logger.level = "debug";
  }

  retrieve(bluID: string, id: string): Promise<Tweet | undefined> {
    return this._repository.findOne(bluID, id);
  }

  async update(
    twitterID: string,
    blueID: string,
    tweets: Tweet[]
  ): Promise<number> {
    console.log(`Updating ${twitterID} with ${blueID}`);

    let total = 0;
    let startTime;

    const createList: Tweet[] = [];
    const fromTwitter: Tweet[] = [];
    const items = await this._repository.list(blueID);
    if (items === undefined) return 0;

    tweets
      .splice(0, 500)
      .sort((a, b) => (a.time > b.time ? 1 : -1))
      // .slice(0, 50)
      .forEach((tweet) => {
        fromTwitter.push(tweet);

        if (items.find((e) => e.id === tweet.id) === undefined) {
          tweet.wasDeleted = false;
          createList.push(tweet);
        }
      });

    console.log("Insert :", createList.length);
    console.log("Deleted :", items.length - fromTwitter.length);
    console.log("Total :", total);

    const fromTwitterMap = new Set<string>();
    fromTwitter.forEach((e) => fromTwitterMap.add(e.id));
    const deletedList = items.filter((elm) => !fromTwitterMap.has(elm.id));

    for (let dto of createList) {
      // Get list for caching
      startTime = Date.now();

      try {
        const createDTO: Tweet = {
          id: dto.id,
          screenName: dto.screenName,
          text: dto.text,
          time: Date.parse(dto.time.toString()),
          isPinned: dto.isPinned,
          isReplyTo: dto.isReplyTo,
          isRetweet: dto.isRetweet,
          urls: dto.urls,
          hashtags: dto.hashtags,
          images: dto.images,
          wasDeleted: dto.wasDeleted,
        };

        console.log(await this._repository.create(blueID, createDTO));
      } catch (e) {
        console.log(`Error, cant create entry. Error: ${e}`);
        console.log(dto);
      }
      console.log(`Insert one for ${Date.now() - startTime} ms`);
    }

    for (let dto of deletedList) {
      // Get list for caching
      startTime = Date.now();
      try {
        if (dto.wasDeleted) continue;
        dto.wasDeleted = true;
        console.log(await this._repository.update(blueID, dto));
      } catch (e) {
        console.log(`Error, cant update entry. Error: ${e}`);
        console.log(dto);
      }
      console.log(`Insert one for ${Date.now() - startTime} ms`);
    }

    return tweets.length;
  }
}
