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
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {Action} from "redux";
import actions from "../actions";
import {Tweet} from "../../core/tweet";

export const getDetails = createDataLoaderDetailActions(
  endpoint + ":id/",
  TWEETS_PREFIX
);
