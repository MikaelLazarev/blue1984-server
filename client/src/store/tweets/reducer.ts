/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { createDataLoaderReducer } from "../dataloader/reducer";
import { Tweet } from "../../core/tweet";
import { TWEETS_PREFIX } from "./";

export default createDataLoaderReducer<Tweet>(TWEETS_PREFIX);
