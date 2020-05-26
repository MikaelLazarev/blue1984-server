/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Tweet } from "../../core/tweet";

// @ts-ignore
import { Tweet as TweetComponent } from "react-fake-tweet";
import "react-fake-tweet/dist/index.css";
import { TweetWidget } from "./TweetWidget";

interface TweetsFeedWidgetProps {
  data: Tweet[];
}

export const TweetsFeedWidget: React.FC<TweetsFeedWidgetProps> = ({ data }) => {
  return <>
    {data.map((elm) => <TweetWidget data={elm} key={elm.id} />) }
    </>
};
