import {
  Tweet,
  tweetComparator,
  TweetsRepositoryI,
  TweetsServiceI,
} from "../core/tweet";
import { Container, Service } from "typedi";
import { TweetsRepository } from "../repository/tweetsRepository";
import {
  Account,
  AccountsRepositoryI,
  AccountsServiceI,
} from "../core/accounts";
import { AccountsRepository } from "../repository/accountsRepository";
import { AccountListDTO } from "../payloads/accounts";
import { AccountsService } from "./accountsService";
import { TwitterRepositoryI } from "../core/twitter";
import { ConfigService } from "../config";
import { TwitterRepository } from "../repository/twitterRepository";
import { FeedQuery, TweetsListDTO } from "../payloads/tweets";
import { ErrorHandler } from "../middleware/errorHandler";
import {Logger} from "tslog";

@Service()
export class TweetsService implements TweetsServiceI {
  private readonly _repository: TweetsRepositoryI;
  private readonly _accountRepository: AccountsRepositoryI;
  private readonly _accountService: AccountsServiceI;
  private readonly _twitterRepository: TwitterRepositoryI;
  private readonly _updateDelay: number;
  private readonly _logger: Logger;
  private _updater: NodeJS.Timeout;

  constructor() {
    this._logger = new Logger({
      minLevel: "debug",
      displayFunctionName: false,
      displayLoggerName: false,
      displayFilePath: "hidden",
    });
    this._repository = Container.get(TweetsRepository);
    this._accountRepository = Container.get(AccountsRepository);
    this._accountService = Container.get(AccountsService);
    this._twitterRepository = Container.get(TwitterRepository);
    this._updateDelay = Container.get(ConfigService).updateDelay;

    this.startUpdate();
  }

  async feed(
    dto: AccountListDTO,
    feedQuery: FeedQuery
  ): Promise<TweetsListDTO> {
    const accounts = await this._accountService.list(dto);
    if (accounts.length === 0) return new TweetsListDTO([]);
    const allTweets: Tweet[] = [];
    for (let account of accounts) {
      const tweets = (await this._repository.list(account.bluID)) || [];
      const tweetsFiltered = feedQuery.showDeleted
        ? tweets.filter((e) => e.wasDeleted)
        : tweets;
      allTweets.push(...tweetsFiltered);
    }


    const start = feedQuery.offset;
    const end = Math.min(allTweets.length, start + feedQuery.limit);

    const tweetsResponse = allTweets.sort(tweetComparator).slice(start, end);
    this._logger.debug(tweetsResponse);

    return new TweetsListDTO(
      tweetsResponse,
      end !== allTweets.length ? end : undefined
    );
  }

  startUpdate() {
    console.log("Updates started...");
    this.stopUpdate();
    // this._updater = setTimeout(async () => await this.updateAll(), 1000);
  }

  stopUpdate() {
    if (this._updater) {
      clearTimeout(this._updater);
    }
  }

  async updateAll() {
    console.log("Stating updates...");
    const accounts = await this._accountRepository.list();
    if (accounts === undefined) {
      console.log("Nothing to update, cause accounts are empty");
    } else {
      this._logger.info(`Got ${accounts.length} account for updating.`);
      for (let acc of accounts) {
        setImmediate(async () => await this.update(acc));
      }
    }

    this._logger.info(`Update finished, next in ${this._updateDelay} sec`);
    this._updater = setTimeout(
      async () => await this.updateAll(),
      this._updateDelay * 1000
    );
  }

  async update(account: Account) {
    const { username, bluID } = account;
    this._logger.info(`Updating ${username} with ${bluID}`);

    try {
      const tweets = await this._twitterRepository.getUserTimeline(account.id);

      const savedTweets = await this._repository.list(bluID);
      if (savedTweets === undefined) return;

      const savedTweetsId = new Set<string>(savedTweets.map((t) => t.id));
      const fromTwittersId = new Set<string>(tweets.map((t) => t.id));

      const deletedTweets = savedTweets.filter(
        (t) => !fromTwittersId.has(t.id)
      );
      const newTweets = tweets.filter((t) => !savedTweetsId.has(t.id));

      this._logger.info(`New tweets to inserts: ${newTweets.length}`);
      this._logger.info(`Total deleted tweets: ${deletedTweets.length}`);

      await this._createTweets(bluID, newTweets);
      await this._labelDeletedTweets(bluID, deletedTweets);

      await this._accountService.updateAccount(
        account,
        savedTweets.length + newTweets.length,
        deletedTweets.length
      );
    } catch (e) {
      ErrorHandler.captureException(e);
    }
  }

  private async _createTweets(blueID: string, newTweets: Tweet[]) {
    for (let i = 0; i < newTweets.length; i++) {
      // Get list for caching
      const startTime = Date.now();

      try {
        await this._repository.create(blueID, newTweets[i]);

        if (i % 10 === 0)
          this._logger.info(`${i} of ${newTweets.length} for creating tweets`);
      } catch (e) {
        this._logger.error(`Error, cant create entry. Error: ${e}`);
        this._logger.error(newTweets[i]);
      }
      this._logger.info(`Insert one for ${Date.now() - startTime} ms`);
    }
  }

  private async _labelDeletedTweets(blueID: string, deletedTweets: Tweet[]) {
    for (let tweet of deletedTweets) {
      // Get list for caching
      const startTime = Date.now();
      try {
        if (tweet.wasDeleted) continue;
        tweet.wasDeleted = true;
        await this._repository.update(blueID, tweet);
      } catch (e) {
        this._logger.error(`Error, cant update entry. Error: ${e}`);
        this._logger.error(tweet);
      }
      this._logger.info(`Updating ccount ${Date.now() - startTime} ms`);
    }
  }
}
