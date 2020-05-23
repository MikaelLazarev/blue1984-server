import { TweetsServiceI } from "../core/tweet";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../types";

@injectable()
export class TweetsController {
  private _service: TweetsServiceI;

  constructor(@inject(TYPES.TweetsService) service: TweetsServiceI) {
    this._service = service;
  }

  retrieve() {
    return (req: Request, res: Response) => {
      const id = req.params.id;
      if (id === undefined) {
        return res.status(400).send("No id");
      }

      this._service
        .list(id)
        .then((result) => res.json(result))
        .catch(() => res.status(400).send());
    };
  }
}
