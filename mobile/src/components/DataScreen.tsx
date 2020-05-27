/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

import React, {ReactElement, ReactNode} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {STATUS} from '../utils/status';
import LoadingView from './Loading';
import FailureView from './Failure';


export interface DataScreenComponentProps<T> {
  data: T;
  onSelect?: (id: string) => void;
}

interface DataScreenProps<T> {
  data: T;
  status: STATUS;
  component: (props: DataScreenComponentProps<T>) => React.ReactNode;
  onSelect?: (id: string) => void;
}

export function DataScreen<T>({
  data,
  status,
  component,
  onSelect,
}: DataScreenProps<T>): ReactElement {
  switch (status) {
    default:
    case STATUS.LOADING:
      return <LoadingView />;

    case STATUS.FAILURE:
      return <FailureView error="Oops! It's a problem connecting server" />;

    case STATUS.UPDATING:
    case STATUS.SUCCESS:
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollContainer}>
            {component({data, onSelect})}
          </ScrollView>
        </SafeAreaView>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7F8',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    marginBottom: 0,
    padding: 0,
  },
  scrollContainer: {
    width: '100%',
  },
});
