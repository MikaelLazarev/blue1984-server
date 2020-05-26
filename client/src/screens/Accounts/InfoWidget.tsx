/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useEffect, useState} from "react";
import {Account} from "../../core/accounts";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {toHumanDate} from "../../utils/formaters";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import actions from "../../store/actions";
import {RootState} from "../../store";
import {STATUS} from "../../utils/status";
import {TweetsFeedWidget} from "../../containers/Tweets/TweetsFeedWidget";
import {Loading} from "../../components/Loading";

interface InfoWidgetProps {
  data: Account;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({ data }) => {

  if (data === undefined) return  <Loading/>

  return (
    <Row style={{ marginTop: "20px" }}>
      <Col lg={8} md={8} xs={12}>
        <TweetsFeedWidget data={data.tweets || []}/>
      </Col>
      <Col lg={4} md={4} xs={12}>
        <Card>
          <Card.Header className="card-header" style={{backgroundColor: '#F0F0F0'}}>
            <h6 className="mg-b-0" >Info</h6>
          </Card.Header>
          <Card.Body className="pd-20">
            <div className="table-responsive">
              Owner: {data.id}
              <br />
              Tweets cached: {data.cached || '-'}
              <br />
              Tweets changed: {data.changed || '-'}
            </div>

          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
