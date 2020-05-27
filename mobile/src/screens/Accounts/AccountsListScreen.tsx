/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AccountList} from '../../containers/Accounts/ListView';
import {RootState} from '../../store';
import actions from '../../store/actions';
import {DataScreen} from '../../components/DataScreen';
import {useNavigation} from '@react-navigation/native';

export const AccountsListScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [hash, setHash] = useState('0');

  useEffect(() => {
    const newHash = Date.now().toString();
    setHash(newHash);
    dispatch(actions.accounts.getList(newHash));
  }, []);

  const {data, status} = useSelector((state: RootState) => state.accounts.List);

  console.log("HELLOO!", data, status)

  const onSelect = (id: string) => navigation.navigate('AccountDetails', {id});

  return (
      <DataScreen
        data={data}
        status={status}
        component={AccountList}
        onSelect={onSelect}
      />
  );
};
