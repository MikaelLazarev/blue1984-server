import React from 'react';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import * as yup from 'yup';
import {Button, Input, Text} from 'react-native-elements';
import {TextInput, View} from 'react-native';

export interface FieldI {
  label: string;
  placeholder?: string;
  type?: 'input' | 'textarea';
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export interface FormikFormViewProps<T> {
  data?: T;
  onSubmit: (values: T) => void;
  isSubmitted: boolean;
}

interface FormikFormProps<T, S> {
  formSchema: yup.ObjectSchema;
  fields: {[T in keyof yup.InferType<S>]: FieldI};
  initialValues: T;
  onSubmit: (values: T) => void;
  onChange?: (event?: React.FormEvent<HTMLFormElement>) => void;
  isSubmitted: boolean;
}

type FieldComponent =
  | string
  | React.ComponentType
  | React.ForwardRefExoticComponent<any>;

export function FormikForm<T, S>({
  formSchema,
  fields,
  initialValues,
  onChange,
  onSubmit,
  isSubmitted,
}: FormikFormProps<T, S>): React.ReactElement {
  function getComponent(
    name: string,
    f: FieldI,
    {setFieldValue, values}: FormikProps<T>,
  ): React.ReactElement {
    switch (f.type) {
      default:
      case 'input':
      case 'textarea':
        return (
          <Input
            label={f?.label}
            placeholder={f.placeholder || f.label}
            onChangeText={(e) => setFieldValue(name, e)}
            key={name}
          />
        );
    }
  }

  const fieldsRendered = (props: FormikProps<T>) =>
    Object.entries(fields).map((e) => {
      const name = e[0];
      const f = e[1] as FieldI;
      console.log(props);
      return getComponent(name, f, props);
    });

  return (
    <Formik
      validationSchema={formSchema}
      initialValues={initialValues}
      onSubmit={onSubmit}>
      {(props) => (
        <View>
          {fieldsRendered(props)}
          <Button
            onPress={props.handleSubmit}
            disabled={isSubmitted}
            title={'Submit'}
          />
        </View>
      )}
    </Formik>
  );
}
