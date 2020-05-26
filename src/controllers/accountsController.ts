import {
  AccountCreateDTO,
  accountCreateDTOSchema, AccountListDTO, accountListDTOSchema,
  AccountsServiceI,
} from "../core/accounts";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import Ajv, { ValidateFunction } from "ajv";

@injectable()
export class AccountsController {
  private _service: AccountsServiceI;
  private readonly _createDTOValidate: ValidateFunction;
  private readonly _listDTOValidate: ValidateFunction;

  constructor(@inject(TYPES.AccountsService) service: AccountsServiceI) {
    this._service = service;
    this._createDTOValidate = new Ajv().compile(accountCreateDTOSchema);
    this._listDTOValidate = new Ajv().compile(accountListDTOSchema);
  }

  create() {
    return async (req: Request, res: Response) => {
      const dto: AccountCreateDTO = {
        id: req.body.id,
      };

      if (!this._createDTOValidate(dto)) {
        console.log("Incorrect request", dto);
        return res.status(400).send("Incorrect request");
      }

      console.log(dto);

      try {
        const result = await this._service.create(dto);
        console.log(result);
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }
    };
  }

  list() {
    return async (req: Request, res: Response) => {
      const dto: AccountListDTO = {
        accounts: req.body.accounts,
      };

      if (!this._listDTOValidate(dto)) {
        console.log("Incorrect request", dto);
        return res.status(400).send("Incorrect request");
      }

      console.log(dto);
      try {
        const result = await this._service.list(dto);
        console.log(result);
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(400).send(e);
      }

    };
  }

  retrieve() {
    return async (req: Request, res: Response) => {
      const id = req.params.id;
      console.log("RETRIEVE", id)
      if (id === undefined) {
        return res.status(400).send("No id");
      }

      try {
        const result = await this._service.retrieve(id);
        res.status(200).json(result);
      } catch (e) {
        console.log(e);
        res.status(400).send();
      }
    };
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
