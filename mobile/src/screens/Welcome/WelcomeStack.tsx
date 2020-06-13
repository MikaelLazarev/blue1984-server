/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {SplashScreen} from './SplashScreen';

const Stack = createStackNavigator();

export const WelcomeStack: React.FC = () => {

  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{
        header: () => {visible: false},
      }} />
    </Stack.Navigator>
  );
};
