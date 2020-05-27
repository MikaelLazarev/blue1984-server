/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Tweet } from "../../core/tweet";

interface TweetWidgetProps {
  data: Tweet;
}

export const TweetWidget: React.FC<TweetWidgetProps> = ({ data }) => {

    let backColor = "#FFF";
    if (data.wasChanged) backColor = "#b3b37b";
    if (data.wasDeleted) backColor = "#ff5858";

  return (
      <View>
          <Text>{data.screenName}</Text>
      </View>
  );
};
