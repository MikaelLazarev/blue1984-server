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
import AsyncStorage from '@react-native-community/async-storage';

// Get user profile from server
export const getProfile = (): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  const profileStr = await AsyncStorage.getItem("profile");
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
): ThunkAction<void, RootState, unknown, Action<string>> => async dispatch => {
  await AsyncStorage.setItem("profile", JSON.stringify(profile));
  return {
    type: 'FOF',
  }
};

