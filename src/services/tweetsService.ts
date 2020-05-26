import {
  isEqual,
  Tweet,
  TweetsRepositoryI,
  TweetsServiceI,
} from "../core/tweet";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
// @ts-ignore
import { TimelineStream } from "scrape-twitter";

@injectable()
export class TweetsService implements TweetsServiceI {
  private _repository: TweetsRepositoryI;

  public constructor(
    @inject(TYPES.TweetsRepository) repository: TweetsRepositoryI,
  ) {
    this._repository = repository;
  }



  retrieve(bluID: string, id: string): Promise<Tweet | undefined> {
    return this._repository.findOne(bluID, id);
  }

  update(twitterID: string, blueID: string): Promise<number> {
    return new Promise<number>(async (resolve) => {
      console.log(`Updating ${twitterID} with ${blueID}`);
      const scannedTweets: Tweet[] = [];
      const timeline = new TimelineStream(twitterID);

      let total = 0;
      let startTime = Date.now();

      const createList: Tweet[] = [];
      const updateList: Tweet[] = [];
      const items = await this._repository.list(blueID);
      if (items === undefined) return resolve(0);

      timeline.on("data", (dto: Tweet) => {
        total++;
        const found = items.filter((e) => e.id === dto.id);
        if (found.length === 0) {
          dto.wasChanged = false;
          createList.push(dto);
        } else {
          if (!isEqual(found[0], dto)) {
            dto.wasChanged = true;
            updateList.push(dto);
            console.log("For", dto.id);
          }
        }
      });

      timeline.on("end", async () => {
        console.log("Insert :", createList.length);
        console.log("Update :", updateList.length);
        console.log("Total :", total);

        for (let dto of createList) {
          // Get list for caching
          startTime = Date.now();
          try {
            console.log(await this._repository.create(blueID, dto));
          } catch (e) {
            console.log(`Error, cant inset ${dto}. Error: ${e}`);
          }
          console.log(`Insert one for ${Date.now() - startTime} ms`);
        }

        resolve(scannedTweets.length);
      });
    });
  }
}
