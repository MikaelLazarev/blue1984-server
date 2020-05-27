/*
 * Lean tool - hypothesis testing application
 *
 * https://github.com/MikaelLazarev/lean-tool/
 * Copyright (c) 2020. Mikhail Lazarev
 *
 */

import React, {useEffect, useState} from 'react';
import {Account} from '../../core/accounts';
import {Loading} from '../../components/Loading';
import {Text} from 'react-native-elements';
import {View} from 'react-native';

interface InfoWidgetProps {
  data: Account;
}

export const InfoWidget: React.FC<InfoWidgetProps> = ({data}) => {
  if (data === undefined) return <Loading />;

  return (
    <View>
      <Text>Owner: {data.id}</Text>
      <Text> Tweets cached: {data.cached || '-'}</Text>
      <Text>Tweets changed: {data.changed || '-'}</Text>
    </View>
  );
};
