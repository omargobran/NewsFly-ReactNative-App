import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { Container, Spinner } from 'native-base';


import * as firebase from 'firebase';

class LoadingScreen extends Component {

  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.navigation.navigate('DashboardScreen');
      }
      else {
        this.props.navigation.navigate('LoginScreen');
      }
    });
  }

  render() {
    return (
      <Container style={styles.container} androidStatusBarColor='black'>
        <Spinner color='black' />
      </Container>
    );
  }
}

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});