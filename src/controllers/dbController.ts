import {Db} from "../core/db";
import {Get, JsonController} from "routing-controllers";
import {Service} from "typedi";

//app.get("/api/stat/", dbController.retrieve());
@JsonController("/api/stat")
@Service()
export class DbController {
  @Get("/")
  retrieve() {
    return Db.getStat();
  }
}
