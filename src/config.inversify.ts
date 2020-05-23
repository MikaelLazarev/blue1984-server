import { Container } from "inversify";

// Tweets
import { TweetsRepositoryI, TweetsServiceI } from "./core/tweet";
import { TweetsRepository } from "./repository/tweetsRepository";
import { TweetsController } from "./controllers/tweetsController";
import { TweetsService } from "./services/tweetsService";

import { TYPES } from "./types";
import {AccountsRepositoryI, AccountsServiceI} from "./core/accounts";
import {AccountsRepository} from "./repository/accountsRepository";
import {AccountsService} from "./services/accountsService";
import {AccountsController} from "./controllers/accountsController";

let container = new Container();

// TWEETS
container
  .bind<TweetsRepositoryI>(TYPES.TweetsRepository)
  .toConstantValue(TweetsRepository)
  .inSingletonScope();
container.bind<TweetsServiceI>(TYPES.TweetsService).to(TweetsService);
container
  .bind<TweetsController>(TYPES.TweetsController)
  .to(TweetsController);

// ACCOUNTS
container
    .bind<AccountsRepositoryI>(TYPES.AccountsRepository)
    .to(AccountsRepository)
    .inSingletonScope();
container.bind<AccountsServiceI>(TYPES.AccountsService).to(AccountsService);
container
    .bind<AccountsController>(TYPES.AccountsController)
    .to(AccountsController);


export default container;
