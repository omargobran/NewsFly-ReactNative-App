import React from 'react';
import { StyleSheet, View } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import LoginScreen from './screens/LoginScreen';
import LoadingScreen from './screens/LoadingScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';

import * as firebase from 'firebase';
import { firebaseConfig } from './config';

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container} androidStatusBarColor='black'>
        <AppNavigator />
      </View>
    );
  }
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
  RegisterScreen: RegisterScreen
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
