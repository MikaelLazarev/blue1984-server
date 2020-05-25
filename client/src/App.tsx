/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router";

import { SplashScreen } from "./screens/SplashScreen";

import actions from "./store/actions";
import { RootState } from "./store";

import "./App.css";
import { Router } from "./screens/Router";
import { JoinScreen } from "./screens/JoinScreen/JoinScreen";

const App = () => {

  const dispatch = useDispatch();
  useEffect(() =>{
    dispatch(actions.profile.getProfile());
  })

  const appStatus = useSelector((state: RootState) => state.profile.status);

  switch (appStatus) {
    case "NEW":
      return <JoinScreen />;

    case "READY":
      return <Router />;
  }

  return <SplashScreen />;
};

export default App;
