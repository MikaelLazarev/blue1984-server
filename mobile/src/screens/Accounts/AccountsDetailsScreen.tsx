/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, {useEffect, useState} from "react";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";

import { DetailsView } from "../../containers/Accounts/DetailsView";

import actions from "../../store/actions";
import { STATUS } from "../../utils/status";
import Loading from "../../components/Loading";
import { getDetailsItem } from "../../store/dataloader";
import { DataScreen } from "../../components/DataScreen";
import {AccountsStackParamList} from "./AccountsStack";
import {RouteProp, useRoute} from '@react-navigation/native';

type ContactDetailsScreenRouteProp = RouteProp<
    AccountsStackParamList,
    'AccountsDetailsScreen'
    >;

export const AccountsDetailsScreen: React.FC = () => {
  const dispatch = useDispatch();

  const route = useRoute<ContactDetailsScreenRouteProp>();
  const {id} = route.params;

  const [hash, setHash] = useState("0");


  useEffect(() => {
    const newHash = Date.now().toString();
    setHash(newHash);
    dispatch(actions.accounts.getDetails(id, newHash));
  }, [id]);

  const dataItem = useSelector((state: RootState) =>
    getDetailsItem(state.accounts.Details, id)
  );

  const operationStatus = useSelector(
      (state: RootState) => state.operations.data[hash]?.data?.status
  );

  // TODO: Move status to new Dataloader component

  useEffect(() => {
    if (hash !== "0") {
      switch (operationStatus) {
        case STATUS.SUCCESS:
          break;

        case STATUS.FAILURE:
          setHash("0");
      }
    }
  }, [hash, operationStatus]);

  if (!dataItem || !dataItem.data || dataItem.status !== STATUS.SUCCESS) {
    return <Loading />;
  }

  const { data, status } = dataItem;

  return (
      <DataScreen data={data} status={status} component={DetailsView} />
  );
};
