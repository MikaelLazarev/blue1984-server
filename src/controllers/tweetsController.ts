import {Get, JsonController, Param} from "routing-controllers";
import {Inject, Service} from "typedi";
import {TweetsService} from "../services/tweetsService";

@JsonController("/api/tweets")
@Service()
export class TweetsController {
  @Inject()
  private _service: TweetsService;

  @Get("/:blu_id/:id/")
  async retrieve(@Param("blu_id") blu_id: string, @Param("id") id: string) {
    return await this._service.retrieve(blu_id, id);
  }
}
