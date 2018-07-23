import React from 'react';
import FirebaseKeys from './firebaseConfig';
import * as firebase from 'firebase';
import { Image, StyleSheet, Button, Text, View, Alert, } from 'react-native';
import { ImagePicker } from 'expo';

async function allowCameraRoll() {
  const { Permissions } = Expo;
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    alert('Hey! You might want to enable notifications for my app, they are good.');
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isAuthenticationReady: false,
      isAuthenticated: false
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(FirebaseKeys.FirebaseConfig);
    }
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillMount() {
    allowCameraRoll()
  }

  onAuthStateChanged = user => {
   this.setState({ isAuthenticationReady: true });
   this.setState({ isAuthenticated: !!user });
 };

 onChooseImagePress = async () => {

  let result = await ImagePicker.launchImageLibraryAsync();

  if (!result.cancelled) {
    this.uploadImage(result.uri, "test-image")
      .then(() => {
        Alert.alert("Success");
      })
      .catch((error) => {
        Alert.alert(error);
      });
  }
}

uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child("images/" + imageName);
    return ref.put(blob);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Choose image..." onPress={this.onChooseImagePress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, alignItems: "center", },
});
