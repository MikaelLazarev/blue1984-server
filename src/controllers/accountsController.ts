import {AccountCreateDTO, AccountListDTO,} from "../core/accounts";
import {Request, Response} from "express";
import {Body, Get, JsonController, Param, Post} from "routing-controllers";
import {getLogger, Logger} from "log4js";
import {Inject} from "typedi";
import {AccountsService} from "../services/accountsService";

// Accounts Controller
// app.post("/api/accounts/list/", accountsController.list());
// app.post("/api/accounts/feed/", accountsController.feed());
// app.post("/api/accounts/", accountsController.create());
// app.get("/api/accounts/start", accountsController.startUpdates());
// app.get("/api/accounts/stop", accountsController.stopUpdates());
// app.get("/api/accounts/:id/", accountsController.retrieve());

@JsonController("/api/accounts")
export class AccountsController {
  @Inject()
  private _service: AccountsService

  private _logger: Logger;

  constructor() {
    this._logger = getLogger();
    this._logger.level = "debug";
  }

  @Post("/")
  async create(@Body() dto: AccountCreateDTO) {
    console.log("CREADE", dto);

    return await this._service.create(dto);
  }

  @Post("/list/")
  async list(@Body() dto: AccountListDTO) {
    console.log(dto);
    return await this._service.list(dto);
  }

  @Post("/feed/")
  async feed(@Body() dto: AccountListDTO) {
    console.log(dto);
    return await this._service.feed(dto);
  }

  @Get("/:id/")
  async retrieve(@Param("id") id: string) {
    return await this._service.retrieve(id);
  }

  startUpdates() {
    return (req: Request, res: Response) => {
      this._service.startUpdate();
      res.status(200).send("Updates started");
    };
  }

  stopUpdates() {
    return (req: Request, res: Response) => {
      this._service.startUpdate();
      res.status(200).send("Updates stopped");
    };
  }
}
