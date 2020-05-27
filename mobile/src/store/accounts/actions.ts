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
import AsyncStorage from "@react-native-community/async-storage";

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

console.log("IDDDDDQ", id);
  const action = await dispatch(addAccountAction("new", { id }, hash));
  console.log(action);

  const savedAccounts = await getAccountsFromStorage();
  let accountsList = new Set([id,
    ...savedAccounts
  ]);

  await AsyncStorage.setItem(
    "accounts",
    JSON.stringify(Array.from(accountsList.values()))
  );
};

export const getList = (
  hash: string
): ThunkAction<void, RootState, unknown, Action<string>> => async (
  dispatch
) => {
  const accounts = await getAccountsFromStorage();

  console.log("ACCCCC", accounts);
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

export const  getAccountsFromStorage = async(): Promise<string[]> => {
  let accountsList: string[] = [];
  //await AsyncStorage.clear();
  const savedAccountsStr = await AsyncStorage.getItem("accounts");

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

export const removeAccount = (id: string, hash?: string) : ThunkAction<void, RootState, unknown, Action<string>> => async (
    dispatch
) => {
  const savedAccounts = await getAccountsFromStorage();
  const accountsList = savedAccounts.filter((e) => e != id);
  await AsyncStorage.setItem("accounts", JSON.stringify(accountsList));
  dispatch(updateStatus(hash || "0", STATUS.SUCCESS));
};
