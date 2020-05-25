/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import * as accounts from "./accounts/actions";
import * as profile from "./profile/actions";
import * as tweets from "./tweets/actions";
import * as operations from "./operations/actions";

export default {
  accounts,
  profile,
  operations,
  tweets,
};
