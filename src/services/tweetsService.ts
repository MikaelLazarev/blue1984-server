import {isEqual, Tweet, TweetsRepositoryI, TweetsServiceI} from "../core/tweet";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import { AccountsRepositoryI } from "../core/accounts";
// @ts-ignore
import { TimelineStream } from 'scrape-twitter';

@injectable()
export class TweetsService implements TweetsServiceI {
  private _repository: TweetsRepositoryI;
  private _accountsRepository: AccountsRepositoryI;

  public constructor(
    @inject(TYPES.TweetsRepository) repository: TweetsRepositoryI,
    @inject(TYPES.AccountsRepository) accountsRepository: AccountsRepositoryI
  ) {
    this._repository = repository;
    this._accountsRepository = accountsRepository;
  }

  list(id: string): Promise<Tweet[] | undefined> {
    return new Promise<Tweet[] | undefined>(async (resolve, reject) => {
      try {
        const bluID = await this._accountsRepository.findOne(id);
        if (bluID === undefined)
          throw "This account is not registered in system";
        const result = await this._repository.list(bluID?.bluID);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
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
