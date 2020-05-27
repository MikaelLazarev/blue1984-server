/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Tweet } from "../../core/tweet";
import { TweetWidget } from "./TweetWidget";

interface TweetsFeedWidgetProps {
  data: Tweet[];
}

export const TweetsFeedWidget: React.FC<TweetsFeedWidgetProps> = ({ data }) => {
  return <>
    {data.map((elm) => <TweetWidget data={elm} key={elm.id} />) }
    </>
};
