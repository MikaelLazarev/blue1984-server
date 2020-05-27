/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";

import { Account } from "../../core/accounts";
// import {TotalBar} from '../Bonds/TotalBar';

import {InfoTab} from "./InfoTab";

interface AccountDetailsProps {
  data: Account;
}

export const DetailsView: React.FC<AccountDetailsProps> = ({
  data,
}: AccountDetailsProps) => {
  const tabs: string[] = ["Feed", "Changed", "Deleted"];

  return (<>
          <InfoTab data={data} />
          <InfoTab data={data} filter={(e) => e.wasChanged}/>
          <InfoTab data={data} filter={(e) => e.wasDeleted}/>
          </>
  );
};
