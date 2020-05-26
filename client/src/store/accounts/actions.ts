/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { endpoint, ACCOUNTS_PREFIX } from "./";

import {
  createDataLoaderCreateUpdateDataAction,
  createDataLoaderDetailActions,
  createDataLoaderListActions,
} from "../dataloader/actions";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../index";
import { Action } from "redux";
import { Account } from "../../core/accounts";
import { LIST_FAILURE, LIST_REQUEST, LIST_SUCCESS } from "../dataloader";
import { updateStatus } from "../operations/actions";
import { STATUS } from "../../utils/status";
import {getApiById, getFullAPIAddress} from "../../utils/api";
import { createAction } from "redux-api-middleware";
import * as actionTypes from "../dataloader";

const addAccountAction = createDataLoaderCreateUpdateDataAction(
  endpoint,
  endpoint,
  ACCOUNTS_PREFIX
);

export const addNewAccount = (
  id: string,
  hash: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  const action = await dispatch(addAccountAction("new", { id }, hash));
  console.log(action);

  const savedAccounts = getAccountsFromStorage();
  let accountsList = new Set([id,
    ...savedAccounts
  ]);

  localStorage.setItem(
    "accounts",
    JSON.stringify(Array.from(accountsList.values()))
  );
};

export const getList = (
  hash: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  const accounts = getAccountsFromStorage();
  dispatch(updateStatus(hash || "0", STATUS.UPDATING));

  const action = await dispatch(
    createAction({
      endpoint: getFullAPIAddress(endpoint + "list/"),
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({accounts}),
      types: [
        ACCOUNTS_PREFIX + LIST_REQUEST,
        ACCOUNTS_PREFIX + LIST_SUCCESS,
        ACCOUNTS_PREFIX + LIST_FAILURE,
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

const getAccountsFromStorage = (): string[] => {
  let accountsList: string[] = [];
  const savedAccountsStr = localStorage.getItem("accounts");
  if (savedAccountsStr !== null) {
    const savedAccounts: string[] = JSON.parse(savedAccountsStr);
    accountsList = savedAccounts;
  }
  return accountsList;
};

export const getDetails = createDataLoaderDetailActions(
  endpoint + ":id/",
  ACCOUNTS_PREFIX
);

export const removeAccount = (id: string, hash?: string) => {
  const savedAccounts = getAccountsFromStorage();
  const accountsList = savedAccounts.filter((e) => e != id);
  localStorage.setItem("accounts", JSON.stringify(accountsList));
  return updateStatus(hash || "0", STATUS.SUCCESS);
};
