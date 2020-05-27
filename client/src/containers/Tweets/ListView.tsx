/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Tweet } from "../../core/tweet";
import { DataScreenComponentProps } from "../../components/DataLoader/DataScreen";
import {TweetsFeedWidget} from "./TweetsFeedWidget";
import {useHistory} from "react-router";
import TabsBar from "../../components/PageHeader/TabsBar";
import {TabPane} from "../../components/PageHeader/TabPane";
import {InfoWidget} from "../../screens/Accounts/InfoWidget";

export const TweetsList: React.FC<DataScreenComponentProps<Tweet[]>> = ({
  data,
  onSelect,
}) => {

  const history = useHistory();
  const tabs: string[] = ['Feed', 'Changed', 'Deleted'];

  return (
      <Container className="pd-x-0 pd-lg-x-10 pd-xl-x-0 m-t-20-f pd-t-30-f">
        <TabsBar tabs={tabs} selected={'#feed'} />
        <TabPane hash={'#feed'}>
          <TweetsFeedWidget data={data}/>
        </TabPane>
          <TabPane hash={'#changed'}>
              <TweetsFeedWidget data={data.filter(e => e.wasChanged)}/>
          </TabPane>
          <TabPane hash={'#deleted'}>
              <TweetsFeedWidget data={data.filter(e => e.wasDeleted)}/>
          </TabPane>
      </Container>
  );
};
