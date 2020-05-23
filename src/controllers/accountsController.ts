import {
  AccountCreateDTO,
  accountCreateDTOSchema,
  AccountsServiceI,
} from "../core/accounts";
import {Request, Response} from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";
import Ajv, { ValidateFunction } from "ajv";

@injectable()
export class AccountsController {
  private _service: AccountsServiceI;
  private readonly _createDTOValidate: ValidateFunction;

  constructor(@inject(TYPES.AccountsService) service: AccountsServiceI) {
    this._service = service;
    this._createDTOValidate = new Ajv().compile(accountCreateDTOSchema);
  }

  create() {
    return (req: Request, res: Response) => {

      const dto: AccountCreateDTO = {
        name: req.body.name,
      };

      if (! this._createDTOValidate(dto)) {
        return res.status(400).send("Incorrect request");
      }

      console.log(dto);

      try {
        this._service
            .create(dto)
            .then((result) => {
              console.log(result);
              res.status(200).json(result);
            })
            .catch(() => res.status(400).send());
      } catch (e) {
        console.log(e)
        res.status(400).send(e);
      }
    };
  }

  list() {
    return (req: Request, res: Response) => {

      this._service
        .list()
        .then((result) => res.json(result))
        .catch((e) => res.status(400).send(e));
    };
  }

  startUpdates() {
    return (req: Request, res: Response) => {
      this._service.startUpdate();
      res.status(200).send("Updates started")
    }
  }

  stopUpdates() {
    return (req: Request, res: Response) => {
      this._service.startUpdate();
      res.status(200).send("Updates stopped")
    }
  }


}
