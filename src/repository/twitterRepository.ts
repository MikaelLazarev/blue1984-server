import needle from "needle";
import { Container, Service } from "typedi";
import { transformAndValidate } from "class-transformer-validator";
import { TwitterAccount, TwitterRepositoryI } from "../core/twitter";

import { TwitterProfileDTO } from "../payloads/twitterPayload";
import { Tweet, TweetMedia, TweetURL } from "../core/tweet";
import { ConfigService } from "../config";
import { IncorrectTwitterResponse } from "../errors/twitterErrors";
import { Logger } from "tslog";

interface TimelineParams {
  max_results: number;
  "tweet.fields"?: string;
  "user.fields"?: string;
  "media.fields"?: string;
  expansions?: string;
  exclude?: "replies" | "retweets" | "retweets, replies";
  pagination_token?: string | null;
}

export interface TimelineResponse {
  meta?: {
    result_count: number;
    next_token: string;
  };
  data?: Tweet[];
  includes?: any;
}

@Service()
export class TwitterRepository implements TwitterRepositoryI {
  private readonly _bearerToken: string;

  private readonly _logger: Logger;

  constructor() {
    this._logger = new Logger({
      minLevel: "debug",
      displayFunctionName: false,
      displayLoggerName: false,
      displayFilePath: "hidden",
    });
    const config = Container.get(ConfigService);
    this._bearerToken = config.twitterBearerToken;
  }

  async getUserInfo(id: string): Promise<TwitterProfileDTO> {
    const params = {
      usernames: id, // Edit usernames to look up
      "user.fields": "created_at,description,profile_image_url,name", // Edit optional query parameters here
    };

    const res = await this._apiRequest(
      "https://api.twitter.com/2/users/by?usernames=",
      params
    );
    if (!res.body || res.statusCode !== 200)
      throw new IncorrectTwitterResponse();

    if (!res.body?.data) throw new IncorrectTwitterResponse();

    const result = (await transformAndValidate(
      TwitterProfileDTO,
      res.body?.data
    )) as TwitterProfileDTO[];

    if (result.length === 0) throw new IncorrectTwitterResponse();
    return result[0];
  }

  async getUserTimeline(account: string): Promise<Tweet[]> {
    const result: Tweet[] = [];
    let nextToken = null;
    const endpoint = `https://api.twitter.com/2/users/${account}/tweets`;

    let params: TimelineParams = {
      max_results: 100,
      "tweet.fields": "created_at,author_id,attachments,entities",
      "user.fields": "name,profile_image_url,url,username",
      "media.fields": "media_key,preview_image_url,type,url",
      expansions: "author_id,attachments.media_keys",
      exclude: "replies",
    };

    this._logger.debug("Getting user timeline..", account);

    while (true) {
      const resp = (await this._getPage(
        endpoint,
        params,
        nextToken
      )) as TimelineResponse;

      if (resp?.meta?.result_count && resp.meta.result_count > 0) {
        if (resp.data) {
          const newTweets = (await transformAndValidate(
            Tweet,
            resp.data  || []
          )) as Tweet[];


          const users = (await transformAndValidate(
            TwitterAccount,
            resp.includes.users  || []
          )) as TwitterAccount[];

          const usersMap = new Map<string, TwitterAccount>();
          users.forEach((u) => usersMap.set(u.id, u));

          const media = (await transformAndValidate(
            TweetMedia,
            resp.includes.media || []
          )) as TweetMedia[];

          const mediaMap = new Map<string, TweetMedia>();
          media.forEach((m) => mediaMap.set(m.media_key, m));

          const newTweetsWithAuthor = newTweets.map((tweet) => {
            tweet.author = usersMap.get(tweet.author_id);

            if (tweet.entities?.urls?.length > 1) {
              const urlsSet = new Map<number, TweetURL>();
              tweet.entities.urls.forEach((url) =>
                urlsSet.set(url.start * 10000 + url.end, url)
              );
              tweet.entities.urls = [...urlsSet.values()];
            }

            if (tweet.attachments?.media_keys) {
              tweet.media = [];
              for (let mk of tweet.attachments?.media_keys) {
                const media = mediaMap.get(mk);
                if (media) tweet.media.push(media);
              }
            }
            return tweet;
          });

          result.push(...newTweetsWithAuthor);
        }

        nextToken = resp?.meta?.next_token || null;
        if (nextToken === null) break;
      } else {
        break;
      }
    }

    return result;
  }

  private async _getPage(
    endpoint: string,
    params: TimelineParams,
    nextToken: string | null
  ): Promise<TimelineResponse> {
    if (nextToken) {
      params.pagination_token = nextToken;
    }

    try {
      const resp = await needle("get", endpoint, params, this._authOptions);

      if (resp.statusCode != 200) {
        this._logger.error(resp.headers);
        throw new Error(
          `Twitter API error: ${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`
        );
      }

      return resp.body;
    } catch (err) {
      throw new Error(`Request failed: ${err}`);
    }
  }

  private async _apiRequest(endpoint: string, params: Record<string, string>) {
    return needle("get", endpoint, params, this._authOptions);
  }

  private get _authOptions() {
    return {
      headers: {
        authorization: `Bearer ${this._bearerToken}`,
      },
    };
  }
}
