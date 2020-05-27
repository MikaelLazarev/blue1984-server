/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

import React from 'react';
import {Button} from 'react-native-elements';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {AccountsListScreen} from "./AccountsListScreen";
import {AccountsDetailsScreen} from "./AccountsDetailsScreen";
import {AccountsNewScreen} from "./AccountsNewScreen";

const Stack = createStackNavigator();

export type AccountsStackParamList = {
  AccountDetailsScreen: {id: string};
};

export const AccountsStack: React.FC = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AccountList"
        component={AccountsListScreen}
        options={{
          headerLeft: () => (
            <Button
              // onPress={navigation.getParam('toggleDrawer')}
              icon={{
                name: 'menu',
                size: 22,
              }}
              type="clear"
            />
          ),
          title: 'Accounts',
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('AccountNew')}
              icon={{
                name: 'add',
                size: 22,
              }}
              type="clear"
            />
          ),
        }}
      />
      <Stack.Screen name="AccountDetails" component={AccountsDetailsScreen} />
      <Stack.Screen
        name="AccountNew"
        component={AccountsNewScreen}
        initialParams={{id: 'new'}}
        options={{
          title: 'Add new account',
        }}
      />
    </Stack.Navigator>
  );
};
