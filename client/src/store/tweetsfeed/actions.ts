/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { endpoint, TWEETSFEED_PREFIX } from "./";

import {
  createDataLoaderDetailActions,
  createDataLoaderListActions,
} from "../dataloader/actions";
import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {Action} from "redux";
import actions from "../actions";
import {Tweet} from "../../core/tweet";
import {LIST_SUCCESS} from "../dataloader";


export const getList = (): ThunkAction<void, RootState, unknown, Action<string>> => async (
    dispatch, getState
) => {
  // const accounts = (await dispatch(actions.accounts.getList())).payload;
  // const tweets : Tweet[] = []
  // for(let acc of accounts) {
  //   const feed = await dispatch(getDetails(acc.id))
  //   // @ts-ignore
  //   tweets.push(feed.payload.data)
  // }
  // dispatch({
  //   type: TWEETSFEED_PREFIX + LIST_SUCCESS,
  //   payload: tweets,
  // })

}

export const getDetails = createDataLoaderDetailActions(
  endpoint + ":id/",
    TWEETSFEED_PREFIX
);
