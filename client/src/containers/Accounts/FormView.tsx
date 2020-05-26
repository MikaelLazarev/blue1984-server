/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useEffect, useState} from "react";
import * as yup from "yup";
import {
  FormikForm,
  FormikFormViewProps,
} from "../../components/Forms/FormikForm";
import { Account } from "../../core/accounts";
import { Loading } from "../../components/Loading";
import {TypeaheadOptions} from "../../components/Forms/AutoCompleteField";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import actions from '../../store/actions'

const formSchema = yup.object({
  id: yup.string().required().min(3),
});

interface FormViewProfileProps extends FormikFormViewProps<Account> {}

export const FormView: React.FC<FormViewProfileProps> = ({
  data,
  onSubmit,
  isSubmitted,
}) => {


  const fields = {
    id: {
      label: "Account name",
    },
  };

  if (!data) return <Loading />;

  return (
    <FormikForm
      formSchema={formSchema}
      fields={fields}
      initialValues={data}
      onSubmit={onSubmit}
      isSubmitted={isSubmitted}
    />
  );
};