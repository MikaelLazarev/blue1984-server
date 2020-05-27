/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

import { Account } from "../../core/accounts";
// import {TotalBar} from '../Bonds/TotalBar';

import { useHistory } from "react-router";
import TabsBar from "../../components/PageHeader/TabsBar";
import { TabPane } from "../../components/PageHeader/TabPane";
import { TweetsFeedWidget } from "../Tweets/TweetsFeedWidget";
import { InfoWidget } from "../../screens/Accounts/InfoWidget";
import {InfoTab} from "./InfoTab";

interface AccountDetailsProps {
  data: Account;
}

export const DetailsView: React.FC<AccountDetailsProps> = ({
  data,
}: AccountDetailsProps) => {
  const history = useHistory();
  const tabs: string[] = ["Feed", "Changed", "Deleted"];

  return (
    <Container className="pd-x-0 pd-lg-x-10 pd-xl-x-0 m-t-20-f pd-t-30-f">
      <TabsBar tabs={tabs} selected={"#feed"} />
      <TabPane hash={"#feed"}>
          <InfoTab data={data} />
      </TabPane>
      <TabPane hash={"#changed"}>
          <InfoTab data={data} filter={(e) => e.wasChanged}/>
      </TabPane>
      <TabPane hash={"#deleted"}>
          <InfoTab data={data} filter={(e) => e.wasDeleted}/>
      </TabPane>
    </Container>
  );
};
