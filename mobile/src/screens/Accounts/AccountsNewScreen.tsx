/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';

import {FormView} from '../../containers/Accounts/FormView';

import {STATUS} from '../../utils/status';
import {RootState} from '../../store';
import {Account, AccountCreateDTO} from '../../core/accounts';

import actions from '../../store/actions';
import {useNavigation} from '@react-navigation/native';
import {Alert, SafeAreaView, StyleSheet} from 'react-native';

export const AccountsNewScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [hash, setHash] = useState('0');
  const [waitForList, setWaitForList] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const operationStatus = useSelector(
      (state: RootState) => state.operations.data[hash]?.data,
  );

  // TODO: Move status to new Dataloader component

  useEffect(() => {
    if (hash !== '0' && !waitForList) {
      switch (operationStatus?.status) {
        case STATUS.SUCCESS:
          const newHash = Date.now().toString();
          setHash(newHash);

          dispatch(actions.accounts.getList(newHash));
          setWaitForList(true);

          break;

        case STATUS.FAILURE:
          setHash('0');
          setIsSubmitted(false);
          Alert.alert(
              'Cant add account',
              operationStatus.error || 'Network error',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
          );
          // alert("Cant submit your operation to server");
      }
    }

    if (hash !== '0' && waitForList) {
      switch (operationStatus?.status) {
        case STATUS.SUCCESS:
          setHash('0');
          navigation.navigate('AccountsList');

          break;

        case STATUS.FAILURE:
          setHash('0');
          setIsSubmitted(false);
          Alert.alert(
              'Cant add account',
              operationStatus.error || 'Network error',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
          );
          // alert("Cant submit your operation to server");
      }
    }
  }, [hash, operationStatus]);

  const data: AccountCreateDTO = {
    id: '',
  };
  const onSubmit = (values: AccountCreateDTO) => {
    setIsSubmitted(true);
    const newHash = Date.now().toString();
    setHash(newHash);

    // Emit data
    dispatch(actions.accounts.addNewAccount(values.id, newHash));
  };

  return (
      <SafeAreaView style={styles.container}>
        <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#687882',
              marginTop: 55,
              marginBottom: 15,
            }}>
          Enter valid Twitter account
        </Text>
        <FormView data={data} onSubmit={onSubmit} isSubmitted={isSubmitted} />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'flex-start',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
  },
  button: {
    width: '80%',
    paddingTop: 50,
  },
  button2: {
    paddingTop: 20,
  },
});
