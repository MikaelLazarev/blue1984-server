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
import { LIST_SUCCESS } from "../dataloader";

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
  await dispatch(addAccountAction("new", { id }));

  const savedAccounts = getAccountsFromStorage();
  let accountsList: Array<Account> = [
    {
      id,
      bluID: "",
    },
    ...savedAccounts,
  ];

  localStorage.setItem("accounts", JSON.stringify(accountsList));
};

export const getList = () => {
  return {
    type: ACCOUNTS_PREFIX + LIST_SUCCESS,
    payload: getAccountsFromStorage(),
  };
};

const getAccountsFromStorage = (): Array<Account> => {
  let accountsList: Array<Account> = [];
  const savedAccountsStr = localStorage.getItem("accounts");
  if (savedAccountsStr !== null) {
    const savedAccounts: Array<Account> = JSON.parse(savedAccountsStr);
    accountsList = savedAccounts;
  }
  return accountsList;
};

export const getDetails = createDataLoaderDetailActions(
  endpoint + ":id/",
  ACCOUNTS_PREFIX
);
