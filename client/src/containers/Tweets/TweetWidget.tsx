/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import {Tweet} from "../../core/tweet";

// @ts-ignore
import { Tweet as TweetComponent } from 'react-fake-tweet'
import 'react-fake-tweet/dist/index.css'

interface TweetWidgetProps {
  data: Tweet;
}

export const TweetWidget: React.FC<TweetWidgetProps> = ({
  data,
}) => {

  return (
      <TweetComponent
          config={{
              user: {
                  avatar: "",
                  nickname: data.screenName,
                  name: data.screenName,
              },
              text: data.text,
              date: data.time,
              retweets: data.retweetCount,
              likes: data.favoriteCount
          }}
      />
  );
};

