/*
 *  Buzz Chat - Spam-free decentralized chat
 *
 *  https://github.com/MikaelLazarev/buzzchat
 *  Copyright (c) 2020. Mikhail Lazarev
 */

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {AccountsStack} from './Accounts/AccountsStack';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../store/actions';
import {RootState} from '../store';
import {SplashScreen} from './Welcome/SplashScreen';
import {TweetsFeedScreen} from './Tweets/TweetsFeedScreen';
import {StatStack} from "./Stat/StatStack";
import {WelcomeStack} from "./Welcome/WelcomeStack";

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Feed: 'ios-person',
  Accounts: 'ios-chatbubbles',
  Stat: 'ios-stats',
};

export const Router = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.profile.getProfile());
  });

  const appStatus = useSelector((state: RootState) => state.profile.status);

  switch (appStatus) {
    default:
    case 'NEW':
      return <WelcomeStack/>;

    case 'READY':
      return (
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, color, size}) => {
              const iconName = tabIcons[route.name] || '';

              // You can return any component that you like here!
              return (
                <Icon
                  name={iconName}
                  size={size}
                  color={color}
                  type={'ionicon'}
                />
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: '#0176f4',
            inactiveTintColor: 'gray',
          }}>
          <Tab.Screen name="Feed" component={TweetsFeedScreen} />
          <Tab.Screen name="Accounts" component={AccountsStack} />
          <Tab.Screen name="Stat" component={StatStack} />
        </Tab.Navigator>
      );
  }
};
