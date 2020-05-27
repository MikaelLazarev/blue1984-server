/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FormView } from "../../containers/Accounts/FormView";

import { STATUS } from "../../utils/status";
import { RootState } from "../../store";
import {Account, AccountCreateDTO} from "../../core/accounts";

import actions from "../../store/actions";
import { useNavigation } from "@react-navigation/native";

export const AccountsNewScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [hash, setHash] = useState("0");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const operationStatus = useSelector(
    (state: RootState) => state.operations.data[hash]?.data?.status
  );

  const id = "";

  // TODO: Move status to new Dataloader component

  useEffect(() => {
    if (hash !== "0") {
      switch (operationStatus) {
        case STATUS.SUCCESS:
          navigation.navigate('AccountDetails', {id} );
          break;

        case STATUS.FAILURE:
          setHash("0");
          setIsSubmitted(false);
          // alert("Cant submit your operation to server");
      }
    }
  }, [hash, operationStatus]);

  const data: AccountCreateDTO = {
    id: "",
  };
  const onSubmit = (values: AccountCreateDTO) => {

    console.log("SUMMMMMIT", values);

    setIsSubmitted(true);
    const newHash = Date.now().toString();
    setHash(newHash);

    // Emit data
    dispatch(actions.accounts.addNewAccount(values.id, newHash));
  };

  return (
      <FormView data={data} onSubmit={onSubmit} isSubmitted={isSubmitted} />
  );
};
