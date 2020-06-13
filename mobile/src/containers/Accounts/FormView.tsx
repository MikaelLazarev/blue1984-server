/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React from "react";
import * as yup from "yup";
import {
  FormikForm,
  FormikFormViewProps,
} from "../../components/Forms/FormikForm";
import { AccountCreateDTO} from "../../core/accounts";
import { Loading } from "../../components/Loading";


const formSchema = yup.object({
  id: yup.string().required().min(3),
});

interface FormViewProfileProps extends FormikFormViewProps<AccountCreateDTO> {}

export const FormView: React.FC<FormViewProfileProps> = ({
  data,
  onSubmit,
  isSubmitted,
}) => {


  const fields = {
    id: {
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
