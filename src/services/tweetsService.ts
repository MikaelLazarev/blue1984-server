import {isEqual, Tweet, TweetsRepositoryI, TweetsServiceI} from "../core/tweet";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
// @ts-ignore
import { TimelineStream } from 'scrape-twitter';

@injectable()
export class TweetsService implements TweetsServiceI {
  private _repository: TweetsRepositoryI;

  public constructor(
    @inject(TYPES.TweetsRepository) repository: TweetsRepositoryI,
  ) {
    this._repository = repository;
  }

  retrieve(bluID: string, id: string)  : Promise<Tweet | undefined> {
    return this._repository.findOne(bluID, id);
  }


  update(twitterID: string, blueID: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const timeline = new TimelineStream(twitterID)
      timeline.on('data', async (dto: Tweet) => {
        const found = await this._repository.findOne(blueID, dto.id);
        if (found === undefined) {
          dto.wasChanged = false;
          return this._repository.create(blueID, dto);
        }

        if (!isEqual(found, dto)) {
          dto.wasChanged = true;
          return this._repository.update(blueID, dto);
        }

      })
      timeline.on('end', () => console.log("End"))

    })
  }
}
