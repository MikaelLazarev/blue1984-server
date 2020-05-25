/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import {ThunkAction} from 'redux-thunk';
import {RootState} from '../index';
import {Action} from 'redux';
import {Profile} from '../../core/profile';

// Get user profile from server
export const getProfile = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  const profileStr = localStorage.getItem("profile");
  if ((profileStr) === null) {
    dispatch({
      type: 'PROFILE_SUCCESS',
      payload: {status: 'NEW',
        accounts: [],}

    })
    return
  }
  dispatch({
    type: 'PROFILE_SUCCESS',
    payload: JSON.parse(profileStr),
  });
};


export const updateProfile = (
  profile: Profile,
): Action<string> => {
  localStorage.setItem("profile", JSON.stringify(profile));
  return {
    type: 'FOF',
  }
};

