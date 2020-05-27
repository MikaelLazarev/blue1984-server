/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

import React, {useState} from 'react';
import {FlatList, StyleSheet, ScrollView} from 'react-native';
import {SearchBar} from 'react-native-elements';
import AccountCard from './AccountCard';
import {Account} from '../../core/accounts';
import {DataScreenComponentProps} from '../../components/DataScreen';

const AccountList: React.FC<DataScreenComponentProps<Account[]>> = ({
                                                                      data,
                                                                      onSelect,
                                                                    }) => {
  const [search, setSearch] = useState('');

  const filteredData =
      search === '' ? data : data.filter((elm) => elm.name.search(search) !== -1);

  return (
      <ScrollView style={styles.container}>
        <SearchBar
            placeholder="Type Here..."
            onChangeText={setSearch}
            value={search}
            lightTheme={true}
            round={true}
        />

        <FlatList
            style={styles.container}
            data={filteredData}
            renderItem={(elem) => (
                <AccountCard
                    key={elem.item.id}
                    data={elem.item}
                    selectAccount={onSelect!}
                />
            )}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  header: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default AccountList;
