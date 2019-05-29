/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import Divider from 'react-native-divider';
import { Spinner } from 'native-base';

import * as firebase from 'firebase';

import {getStatusBarHeight} from 'react-native-status-bar-height';

import { Container, Form, Input, Item, Button, Label } from 'native-base';

class LoginScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      email: '',
      password: ''
    };
  }

  componentWillMount() {
    this.setState({isLoading:false});
  }

  logInUser = (email, password) => {
    this.setState({ isLoading: true });
    try {
      if (this.state.password.length === 0 || this.state.email.length === 0) {
        alert("Please fill all fields.");
        this.setState({isLoading:false});
        return;
      }
      firebase.auth().signInWithEmailAndPassword(email, password).then(function (result) {
        console.log(result);
        firebase
                .database()
                .ref('/users/' + result.user.uid).update({
                  lastLoggedIn: Date.now()
                });
        console.log('user signed in');
      }.bind(this)).catch(error => { this.setState({ isLoading : false }); alert(error); });
    }
    catch (error) {
      this.setState({ isLoading: false });
      console(error);
    }
  }

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
          .then(function (result) {
            console.log('user signed in');
            if (result.additionalUserInfo.isNewUser) {
              firebase
                .database()
                .ref('/users/' + result.user.uid)
                .set({
                  email: result.user.email,
                  profilePic: result.additionalUserInfo.profile.picture,
                  locale: result.additionalUserInfo.profile.locale,
                  firstName: result.additionalUserInfo.profile.given_name,
                  lastName: result.additionalUserInfo.profile.family_name,
                  createdAt: Date.now()
                })
                .then(function (snapshot) {
                  //console.log('Snapshot', snapshot);
                });
            }
            else {
              firebase
                .database()
                .ref('/users/' + result.user.uid).update({
                  lastLoggedIn: Date.now()
                });
            }
          })
          .catch(function (error) {
            this.setState({ isLoading: false });
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
          });
      } else {
        this.setState({ isLoading: false });
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  signInWithgoogleAsync = async () => {
    this.setState({isLoading:true});
    try {
      const result = await Expo.Google.logInAsync({
        behavior: 'web',
        androidClientId: '161293357263-beogt1304c7gsvdm18gvio4fprp6nnot.apps.googleusercontent.com',
        iosClientId: '161293357263-dnr8ucq2s2iftho9umpq74i7677ipcnl.apps.googleusercontent.com',
        webClientId: '161293357263-5p90brsi154id8mefbpfeedco14uk2e3.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        this.setState({isLoading:false});
        return result.accessToken;
      }
      else {
        this.setState({isLoading:false});
        return { cancelled: true };
      }
    }
    catch (e) {
      this.setState({isLoading:false});
      return { error: true };
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Container style={styles.container}>
          <Spinner color='black' />
        </Container>
      );
    }
    else {
    return (
      <Container style={styles.containerNative} androidStatusBarColor='black'>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({ email })}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
                secureTextEntry
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(password) => this.setState({ password })}
            />
          </Item>
          <Button full rounded bordered dark style={{ marginTop: 30 }} onPress={() => this.logInUser(this.state.email, this.state.password)}>
            <Text style={{ color: 'black' }}>Log In</Text>
          </Button>
          <Button full rounded bordered dark style={{ marginTop: 10 }} onPress={() => this.props.navigation.navigate('RegisterScreen')}>
            <Text style={{ color: 'black' }}>Register From Here</Text>
          </Button>
          <Divider orientation='center' color='#707070'>OR</Divider>
          <Button full rounded dark onPress={() => this.signInWithgoogleAsync()}>
            <Text style={{ color: 'white' }}>Sign In With Google</Text>
          </Button>
        </Form>
        <View style={styles.bottom}>
          <Text style={{textDecorationLine:'underline'}} onPress={() => Linking.openURL('https://www.linkedin.com/in/omargobran/')}>{'\u00A9'} Made by Omar Gobran</Text>
        </View>
      </Container>
    );
    }
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: '100%',
    width: '100%'
  },
  containerNative: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    paddingTop: getStatusBarHeight()
  },
  bottom: {
    width: '110%',
    height: '5%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0
  }
});