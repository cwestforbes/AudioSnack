import React, { Component } from 'react';
import { ActivityIndicator, Image, View, StyleSheet, Text, TextInput, TouchableOpacity, Button, Alert, ImagePickerIOS } from 'react-native';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation';
import { v4 } from 'uuid';
import { RNS3 } from 'react-native-aws3';

export class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      Email: '',
      Username: '',
      Password: '',
      imageUrl: null,
      isReady: false,
      image: null
    };
  }

  onPressSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
      .then(
        () => {
          let uid = firebase.auth().currentUser.uid;
          let dbRef = firebase.database().ref();
          let usersRef = dbRef.child('users').child(uid);
          let values = { email: this.state.Email, username: this.state.Username };
          usersRef.update(values);
        },
        error => {
          Alert.alert(error.message);
        }
      );
  };

  onPressUpload() {
    let newState = Object.assign({}, this.state.Email, this.state.Username, this.state.Password);
    let imageName = v4();
    let storageRef = firebase.storage().ref(`${imageName}`);
    storageRef.put(blob, metadata).then(result => {
      storageRef.getDownloadURL().then(imgUrl => {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.Email, this.state.Password)
          .then(
            () => {
              let uid = firebase.auth().currentUser.uid;
              let dbRef = firebase.database().ref();
              let usersRef = dbRef.child('users').child(uid);
              let newUserValues = { email: this.state.Email, username: this.state.Username, profileImageUrl: imgUrl };
              usersRef.update(newUserValues);
            },
            error => {
              Alert.alert(error.message);
            }
          );
      });
    });
  }

  onPressReady() {
    this.setState({
      isReady: true
    });
  }

  pickImage = () => {
    ImagePickerIOS.openSelectDialog(
      {},
      imageUri => {
        this.setState({ image: imageUri });
        console.log(this.state);
      },
      error => console.error(error)
    );
  };

  render() {
    if (!this.state.isReady) {
      return (
        <View style={styles.signInContainer}>
          <Text style={styles.logo}>AudioApp</Text>
          <Text style={{ width: 240, textAlign: 'center', marginTop: 10 }}>Sign up to hear audio tracks from your friends</Text>
          <TextInput
            value={this.state.Email}
            onChangeText={input => {
              this.setState({ Email: input });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Email"
            style={{ width: 300, height: 40, borderWidth: 1, borderColor: '#9f9f9f', borderRadius: 3, marginBottom: 10, marginTop: 10, padding: 8 }}
          />
          <TextInput
            value={this.state.Username}
            onChangeText={input => {
              this.setState({ Username: input });
            }}
            placeholder="Username"
            autoCapitalize="none"
            autoCorrect={false}
            style={{ width: 300, height: 40, borderWidth: 1, borderColor: '#9f9f9f', borderRadius: 3, padding: 8, marginBottom: 10 }}
          />
          <TextInput
            value={this.state.Password}
            onChangeText={input => {
              this.setState({ Password: input });
            }}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={{ width: 300, height: 40, borderWidth: 1, borderColor: '#9f9f9f', borderRadius: 3, padding: 8 }}
          />
          <View style={{ marginTop: 30, width: 300 }}>
            <TouchableOpacity style={styles.button} onPress={() => this.onPressReady()}>
              <Text style={{ color: 'white', fontSize: 18 }}>Sign up</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
            <Text style={{ marginRight: 5 }}>Have an account?</Text>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
              <Text style={{ color: '#00a699' }}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 }}>
          {this.state.image ? (
            <Image style={{ width: 100, height: 100, borderRadius: 100 / 2 }} source={{ uri: this.state.image }} />
          ) : (
            <View style={{ width: 100, height: 100, borderWidth: 1 }} />
          )}
          <Button title="Choose Your Avatar" onPress={this.pickImage} />
          <TouchableOpacity style={styles.button} onPress={() => this.onPressUpload()}>
            <Text style={{ color: 'white', fontSize: 18 }}>Next</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  signInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },

  logo: {
    fontSize: 48,
    fontFamily: 'HelveticaNeue-CondensedBold',
    textTransform: 'uppercase',
    color: '#9f9f9f'
  },

  button: {
    backgroundColor: '#00a699',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4
  }
});
