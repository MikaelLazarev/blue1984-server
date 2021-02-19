import {Body, JsonController, Post, QueryParams,} from "routing-controllers";
import {Container, Service} from "typedi";
import {TweetsService} from "../services/tweetsService";
import {AccountListDTO} from "../payloads/accounts";
import {TweetsServiceI} from "../core/tweet";
import {FeedQuery} from "../payloads/tweets";

@JsonController("/api/tweets")
@Service()
export class TweetsController {
  private readonly _service: TweetsServiceI;

  constructor() {
    this._service = Container.get(TweetsService);
  }

  @Post("/")
  async feed(@Body() dto: AccountListDTO, @QueryParams() query: FeedQuery) {
    console.log(dto);
    return await this._service.feed(dto, query);
  }
}
