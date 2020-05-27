import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import actions from '../../store/actions';

export const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();

  const onStart = () => {
    dispatch(
      actions.profile.updateProfile({
        status: 'READY',
      }),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('./1984_cover.jpg')}
        style={{
          height: 200,
          resizeMode: 'contain',
          marginBottom: 8,
          marginTop: -40,
        }}
      />
      <Text h1>Welcome to BLU 1984!</Text>
      <Text h2>Twitter without censorship</Text>
      <Text h2>powered by Bluzelle</Text>
      <View style={styles.button}>
        <Button onPress={onStart}>Break the wall</Button>
        <Button>Take a tour</Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '80%',
    paddingTop: 50,
  },
  button2: {
    paddingTop: 20,
  },
});
