/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import { Tweet } from "../../core/tweet";
import { DataScreenComponentProps } from "../../components/DataScreen";
import {TweetsFeedWidget} from "./TweetsFeedWidget";
import {InfoWidget} from "../Accounts/InfoWidget";

export const TweetsList: React.FC<DataScreenComponentProps<Tweet[]>> = ({
  data,
  onSelect,
}) => {

  const tabs: string[] = ['Feed', 'Changed', 'Deleted'];

  return (
          <TweetsFeedWidget data={data}/>
  );
};
