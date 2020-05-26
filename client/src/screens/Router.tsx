import React from "react";
import { Redirect, Route, Switch } from "react-router";
import AppBar from "../components/AppBar/AppBar";
import { TweetsFeedScreen } from "./Tweets/TweetsFeedScreen";
import { AccountsListScreen } from "./Accounts/AccountsListScreen";
import { AccountsDetailsScreen } from "./Accounts/AccountsDetailsScreen";
import { AccountsNewScreen } from "./Accounts/AccountsNewScreen";

export const Router: React.FC = () => {

  return (
    <>
      <AppBar />
      <Switch>
        <Route
          exact
          path="/accounts"
          component={AccountsListScreen}
        />
        <Route
          exact
          path="/accounts/new"
          component={AccountsNewScreen}
        />
        <Route
          exact
          path="/accounts/:id"
          component={AccountsDetailsScreen}
        />
        <Route
          exact
          path="/feed"
          component={TweetsFeedScreen}
        />

        <Route path={"*"}>
          <Redirect to={"/feed"} />
        </Route>
      </Switch>
    </>
  );
};
