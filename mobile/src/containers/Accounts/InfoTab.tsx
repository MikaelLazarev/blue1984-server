import React from "react";
import { Account } from "../../core/accounts";
import { Tweet } from "../../core/tweet";
import { TweetsFeedWidget } from "../Tweets/TweetsFeedWidget";
import { InfoWidget } from "./InfoWidget";

interface InfoTabProps {
  data: Account;
  filter?: (tweets: Tweet) => boolean;
}
export const InfoTab: React.FC<InfoTabProps> = ({ data, filter }) => {
  let wFiler = (e: Tweet) => true;
  if (filter !== undefined) wFiler = filter;

  return (
      <>
        <TweetsFeedWidget data={data.tweets?.filter(wFiler) || []} />
        <InfoWidget data={data} />
        </>
  );
};
