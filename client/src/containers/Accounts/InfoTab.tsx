import React from "react";
import { Account } from "../../core/accounts";
import { Tweet } from "../../core/tweet";
import { Col, Row } from "react-bootstrap";
import { TweetsFeedWidget } from "../Tweets/TweetsFeedWidget";
import { InfoWidget } from "../../screens/Accounts/InfoWidget";

interface InfoTabProps {
  data: Account;
  filter?: (tweets: Tweet) => boolean;
}
export const InfoTab: React.FC<InfoTabProps> = ({ data, filter }) => {
  let wFiler = (e: Tweet) => true;
  if (filter !== undefined) wFiler = filter;

  return (
    <Row style={{ marginTop: "20px" }}>
      <Col lg={8} md={8} xs={12}>
        <TweetsFeedWidget data={data.tweets?.filter(wFiler) || []} />
      </Col>
      <Col lg={4} md={4} xs={12}>
        <InfoWidget data={data} />
      </Col>
    </Row>
  );
};
