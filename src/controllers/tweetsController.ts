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
    return async (req: Request, res: Response) => {
      const blu_id = req.params.blu_id;
      const id = req.params.id;
      if (id === undefined) {
        console.log(id)
        return res.status(400).send("No id");
      }

      try {
        const result = await this._service.retrieve(blu_id, id);
        res.status(200).json(result);
      } catch (e) {
        res.status(400).send();
      }
    };
  }
}
