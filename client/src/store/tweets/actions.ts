/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { endpoint, TWEETS_PREFIX } from "./";

import {
  createDataLoaderDetailActions,
  createDataLoaderListActions,
} from "../dataloader/actions";

export const getList = createDataLoaderListActions(endpoint, TWEETS_PREFIX);

export const getDetails = createDataLoaderDetailActions(
  endpoint + ":id/",
  TWEETS_PREFIX
);
