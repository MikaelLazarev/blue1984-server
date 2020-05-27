/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import { Profile } from "../../core/profile";
import { ProfileActions } from "./";

export interface ProfileState extends Profile {}

const initialState: ProfileState = {
  status: "NEW",
};

export default function createReducer(
  state: ProfileState = initialState,
  action: ProfileActions
): ProfileState {
  switch (action.type) {
    default:
    case "PROFILE_REQUEST":
      return state;
    case "PROFILE_SUCCESS":
      return action?.payload ? action.payload : state;
  }

  return state;
}
