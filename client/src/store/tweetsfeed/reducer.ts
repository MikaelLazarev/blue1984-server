/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { createDataLoaderReducer } from "../dataloader/reducer";
import {Tweet, TweetsFeed} from "../../core/tweet";
import { TWEETSFEED_PREFIX} from "./";
import {combineReducers} from "redux";
import {createDataLoaderListReducer} from "../dataloader/list";
import {createDataLoaderDetailsReducer} from "../dataloader/details";

export default combineReducers({
    List: createDataLoaderListReducer<Tweet>(TWEETSFEED_PREFIX),
    Details: createDataLoaderDetailsReducer<TweetsFeed>(TWEETSFEED_PREFIX),
});
