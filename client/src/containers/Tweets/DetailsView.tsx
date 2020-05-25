/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import {Button, Col, Container} from "react-bootstrap";
import { useHistory } from "react-router";
import TabsBar from "../../components/PageHeader/TabsBar";
import { TabPane } from "../../components/PageHeader/TabPane";
import {Tweet} from "../../core/tweet";

interface TemplateDetailsProps {
  data: Tweet;
}

export const DetailsView: React.FC<TemplateDetailsProps> = ({
  data,
}: TemplateDetailsProps) => {
  const history = useHistory();
  const tabs: string[] = ['Info', 'Milestones', 'Reviews'];

  return (
    <Container className="pd-x-0 pd-lg-x-10 pd-xl-x-0 m-t-20-f pd-t-30-f">
      <TabsBar tabs={tabs} selected={'info'} />
      <TabPane hash={'#info'}>
      </TabPane>
        <TabPane hash={'#milestones'}>
        </TabPane>
    </Container>
  );
};

