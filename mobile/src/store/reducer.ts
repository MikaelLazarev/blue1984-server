/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { combineReducers } from "redux";
import accounts from './accounts/reducer'
import operations from './operations/reducer'
import profile from './profile/reducer'
import tweets from "./tweets/reducer";
import stat from "./stat/reducer";

export default combineReducers({
  accounts,
  operations,
  profile,
  tweets,
  stat,
});
