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

interface TweetWidgetProps {
  data: Tweet;
}

export const TweetWidget: React.FC<TweetWidgetProps> = ({ data }) => {

    let backColor = "#FFF";
    if (data.wasChanged) backColor = "#b3b37b";
    if (data.wasDeleted) backColor = "#ff5858";

  return (
    <div style={{ marginBottom: "20px" }}>
      <TweetComponent
        config={{
          user: {
            avatar: "https://pbs.twimg.com/profile_images/633849199763656706/PLWdxCam_400x400.jpg",
            nickname: data.user?.nickname,
            name: data.user?.name,
          },
          text: data.text,
          date: data.time,
          retweets: data.retweetCount,
          likes: data.favoriteCount,
        }}
        style={{backgroundColor: backColor}}
      />
    </div>
  );
};
