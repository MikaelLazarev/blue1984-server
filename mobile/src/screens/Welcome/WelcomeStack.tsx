/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from './SplashScreen';
import {EnterMnemonicScreen} from '../Account/EnterMnemonicScreen';

const Stack = createStackNavigator();

export type ContactStackParamList = {
  ContactDetailsScreen: {id: string};
  ContactEditScreen: {id: string};
};

export const WelcomeStack: React.FC = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="EnterMnemonicScreen" component={EnterMnemonicScreen} />
    </Stack.Navigator>
  );
};
