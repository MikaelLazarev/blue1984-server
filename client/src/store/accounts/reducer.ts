/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { createDataLoaderReducer } from "../dataloader/reducer";
import { Account } from "../../core/accounts";
import { ACCOUNTS_PREFIX } from "./";

export default createDataLoaderReducer<Account>(ACCOUNTS_PREFIX);
