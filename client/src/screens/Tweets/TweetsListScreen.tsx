/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, { useEffect } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useDispatch, useSelector } from "react-redux";

import { Breadcrumb } from "../../components/PageHeader/Breadcrumb";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import { useHistory } from "react-router";
import { Loading } from "../../components/Loading";
import { STATUS } from "../../utils/status";
import { TweetsList } from "../../containers/Tweets/ListView";
import { RootState } from "../../store";
import actions from "../../store/actions";
import { ToolbarButton } from "../../containers/ToolbarButton";
import { DataScreen } from "../../components/DataLoader/DataScreen";

export const TweetsListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.tweets.getList());
  }, []);

  const { data, status } = useSelector(
    (state: RootState) => state.tweets.List
  );

  const breadcrumbs: Breadcrumb[] = [
    {
      url: "/tweets",
      title: "Tweets",
    },
  ];

  const onSelect = (id: string) => history.push(`/tweets/${id}`);

  const rightToolbar = (
    <ToolbarButton
      title={"+ Tweet"}
      onClick={() => history.push("/tweets/new/edit")}
    />
  );

  return (
    <div className="content content-fixed">
      <PageHeader
        title={"Tweets"}
        breadcrumbs={breadcrumbs}
        rightPanel={rightToolbar}
      />
      <DataScreen
        data={data}
        status={status}
        component={TweetsList}
        onSelect={onSelect}
      />
    </div>
  );
};
