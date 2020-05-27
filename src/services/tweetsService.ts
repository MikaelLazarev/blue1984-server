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
    @inject(TYPES.TweetsRepository) repository: TweetsRepositoryI
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
      try {
        const timeline = new TimelineStream(twitterID);

        let total = 0;
        let startTime = Date.now();

        const createList: Tweet[] = [];
        const updateList: Tweet[] = [];
        const fromTwitter: Tweet[] = [];
        const items = await this._repository.list(blueID);
        if (items === undefined) return resolve(0);

        timeline.on('error', () => {
          console.log("SHIT")
          resolve(0);
        })

        timeline.on("data", (dto: Tweet) => {
          total++;

          if (total > 50) return;
          fromTwitter.push(dto);
          const found = items.filter((e) => e.id === dto.id);
          if (found.length === 0) {
            dto.wasChanged = false;
            dto.wasDeleted = false;
            createList.push(dto);
          } else {
            if (!isEqual(found[0], dto)) {
              dto.wasChanged = true;
              dto.wasDeleted = false;
              updateList.push(dto);
              console.log("For", dto.id);
            }
          }
        });

        timeline.on("end", async () => {
          console.log("Insert :", createList.length);
          console.log("Update :", updateList.length);
          console.log("Deleted :", items.length - fromTwitter.length);
          console.log("Total :", total);

          const fromTwitterMap = new Set<string>();
          fromTwitter.forEach((e) => fromTwitterMap.add(e.id));
          const deletedList = items.filter(
            (elm) => !fromTwitterMap.has(elm.id)
          );

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

          for (let dto of deletedList) {
            // Get list for caching
            startTime = Date.now();
            try {
              dto.wasDeleted = true;
              console.log(await this._repository.update(blueID, dto));
            } catch (e) {
              console.log(`Error, cant inset ${dto}. Error: ${e}`);
            }
            console.log(`Insert one for ${Date.now() - startTime} ms`);
          }

          for (let dto of updateList) {
            // Get list for caching
            startTime = Date.now();
            try {
              dto.wasChanged = true;
              console.log(await this._repository.update(blueID, dto));
            } catch (e) {
              console.log(`Error, cant inset ${dto}. Error: ${e}`);
            }
            console.log(`Insert one for ${Date.now() - startTime} ms`);
          }

          resolve(scannedTweets.length);
        });
      } catch (e) {
        console.log(e);
      }
    });
  }
}
