import { Body, Get, JsonController, Param, Post } from "routing-controllers";
import { getLogger, Logger } from "log4js";
import { Inject } from "typedi";
import { AccountsService } from "../services/accountsService";
import { AccountCreateDTO, AccountListDTO } from "../payloads/accounts";

@JsonController("/api/accounts")
export class AccountsController {
  @Inject()
  private _service: AccountsService;

  private _logger: Logger;

  constructor() {
    this._logger = getLogger();
    this._logger.level = "debug";
  }

  @Post("/")
  async create(@Body() dto: AccountCreateDTO) {
    return await this._service.create(dto);
  }

  @Post("/list/")
  async list(@Body() dto: AccountListDTO) {
    return await this._service.list(dto);
  }

  @Get("/:id/")
  async retrieve(@Param("id") id: string) {
    return await this._service.retrieve(id);
  }
}
