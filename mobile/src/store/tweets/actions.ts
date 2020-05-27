/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { endpoint, TWEETS_PREFIX } from "./";

import {ThunkAction} from "redux-thunk";
import {RootState} from "../index";
import {Action} from "redux";
import {updateStatus} from "../operations/actions";
import {STATUS} from "../../utils/status";
import {createAction} from "redux-api-middleware";
import {getFullAPIAddress} from "../../utils/api";
import {LIST_FAILURE, LIST_REQUEST, LIST_SUCCESS} from "../dataloader";
import {getAccountsFromStorage} from "../accounts/actions";

export const getFeed = (
    hash: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
    dispatch
) => {
  const accounts = await getAccountsFromStorage();
  dispatch(updateStatus(hash || "0", STATUS.UPDATING));

  const action = await dispatch(
      createAction({
        endpoint: getFullAPIAddress(endpoint),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({accounts}),
        types: [
          TWEETS_PREFIX + LIST_REQUEST,
          TWEETS_PREFIX + LIST_SUCCESS,
          TWEETS_PREFIX + LIST_FAILURE,
        ],
      })
  );

  if (action.error) {
    dispatch(updateStatus(hash || "0", STATUS.FAILURE, action.payload.message));
  } else {
    dispatch(updateStatus(hash || "0", STATUS.SUCCESS));
  }

  return action;
};
