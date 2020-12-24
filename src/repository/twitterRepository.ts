import needle from "needle";
import { Container, Service } from "typedi";
import { transformAndValidate } from "class-transformer-validator";
import { TwitterRepositoryI } from "../core/twitter";

import { TwitterProfileDTO } from "../payloads/twitter";
import { Tweet } from "../core/tweet";
import { ConfigService } from "../config";

interface TimelineParams {
  max_results: number;
  "tweet.fields": string;
  pagination_token?: string | null;
}

interface TimelineResponse {
  meta?: {
    result_count: number;
    next_token: string;
  };
  data?: Tweet[];
}

@Service()
export class TwitterRepository implements TwitterRepositoryI {
  private readonly _bearerToken: string;

  constructor() {
    const config = Container.get(ConfigService);
    this._bearerToken = config.twitterBearerToken;
  }

  async getUserInfo(id: string): Promise<TwitterProfileDTO> {
    const params = {
      usernames: id, // Edit usernames to look up
      "user.fields": "created_at,description", // Edit optional query parameters here
    };

    const res = await this._apiRequest(
      "https://api.twitter.com/2/users/by?usernames=",
      params
    );
    console.log("RRR", res);
    if (!res.body || res.statusCode !== 200)
      throw new Error("Unsuccessful request");

    if (!res.body?.data) throw new Error("Incorrect twitter response");
    const result = (await transformAndValidate(
      TwitterProfileDTO,
      res.body?.data
    )) as TwitterProfileDTO[];

    if (result.length === 0) throw new Error("Incorrect twitter response");

    return result[0];
  }

  async getUserTimeline(account: string): Promise<Tweet[]> {
    const result: Tweet[] = [];
    let nextToken = null;
    const endpoint = `https://api.twitter.com/2/users/${account}/tweets`;

    let params: TimelineParams = {
      max_results: 100,
      "tweet.fields": "created_at",
    };

    console.log("Retrieving Tweets...", account);

    while (true) {
      const resp = (await this._getPage(
        endpoint,
        params,
        nextToken
      )) as TimelineResponse;

      console.log("META", resp?.meta);
      if (resp?.meta?.result_count && resp.meta.result_count > 0) {
        if (resp.data) {
          const newTweets = (await transformAndValidate(
            Tweet,
            resp.data
          )) as Tweet[];
          result.push(...newTweets);
        }

        nextToken = resp?.meta?.next_token || null;
        if (nextToken === null) break;
      } else {
        break;
      }
    }

    console.log(`Got ${result.length} Tweets from ${account}!`);
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
      console.log("PARAMS", params);
      const resp = await needle("get", endpoint, params, this._authOptions);

      if (resp.statusCode != 200) {
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
