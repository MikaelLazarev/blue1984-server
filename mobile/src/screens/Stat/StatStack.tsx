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
import {StatScreen} from "./StatScreen";
import actions from "../../store/actions";
import {useDispatch} from "react-redux";

const Stack = createStackNavigator();

export const StatStack: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StatScreen"
        component={StatScreen}
        options={{
          title: 'Statistic',
            headerRight: () => (
                <Button
                    onPress={() => dispatch(actions.stat.getList())}
                    title={'Update'}
                    type="clear"
                />
            ),
            //
        }}
      />
    </Stack.Navigator>
  );
};
