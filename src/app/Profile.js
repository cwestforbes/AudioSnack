import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Button, ScrollView, Alert } from 'react-native';
// import { clips } from './../../clipData.json';
import * as firebase from 'firebase';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      profileImgUrl: '',
      clips: 0,
      following: 0,
      followers: 0,
      fetchIsReady: false,
      clips: []
    };
  }

  onPressSignOut = () => {
    firebase.auth().signOut();
  };

  updateProfile = (_username, _email, _imageUrl) => {
    this.setState({
      username: _username,
      email: _email,
      profileImgUrl: _imageUrl,
      fetchIsReady: true
    });
    console.log(this.state);
  };

  checkIfUserIsLoggedIn() {
    let uid = firebase.auth().currentUser.uid;
    console.log(uid);
    return firebase
      .database()
      .ref('/users/' + uid)
      .once('value')
      .then(
        snapshot => {
          let usernameData = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          let emailData = (snapshot.val() && snapshot.val().email) || 'Anonymous';
          let imgData = (snapshot.val() && snapshot.val().profileImageUrl) || 'Anonymous';
          this.downloadImgData(imgData);
          this.updateProfile(usernameData, emailData, imgData);
        },
        error => {
          Alert.alert(error.message);
        }
      );
  }

  checkUserClips() {
    let uid = firebase.auth().currentUser.uid;
    if (firebase.database().ref('/clips/' + uid)) {
      console.log('You have clips!');
    } else {
      console.log('you don\'t have clips' )
    }
  }

  downloadImgData(link) {
    let storageRef = firebase.storage().refFromURL(link);
    storageRef.getDownloadURL().then(
      url => {
        console.log(url);
      },
      error => {
        Alert.alert(error.message);
      }
    );
  }

  componentDidMount() {
    this.checkIfUserIsLoggedIn();
    this.checkUserClips()
  }

  render() {
    if (this.state.fetchIsReady) {
      return (
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{this.state.username}</Text>
          </View>
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: this.state.profileImgUrl }} style={{ width: 128, height: 128, borderRadius: 128 / 2 }} />
            </View>
            <View style={styles.social}>
              <View style={styles.socialText}>
                <Text>{this.state.followers}</Text>
                <Text>Followers</Text>
              </View>
              <View style={styles.socialText}>
                <Text>{this.state.following}</Text>
                <Text>Following</Text>
              </View>
              <View style={styles.socialText}>
                <Text>{this.state.clips}</Text>
                <Text>Clips</Text>
              </View>
            </View>
            <View style={styles.editProfile}>
              <Button title="Edit Profile" color="#5D8586" />
            </View>
          </View>
          <View style={styles.yourClipsContainer}>
            <Text style={styles.yourClipsHeader}>Your Clips</Text>
            <View>
              {this.state.clips.map(clip => (
                <View style={styles.clip} key={clip.id}>
                  <View style={styles.clipLeft}>
                    <Image source={{ uri: `${clip.imageUrl}` }} style={{ height: 50, width: 50 }} />
                    <Text style={styles.clipName}>{clip.name}</Text>
                  </View>
                  <View style={styles.likesContainer}>
                    <Image
                      source={{ uri: 'https://www.shareicon.net/data/128x128/2015/12/01/680403_heart_512x512.png' }}
                      style={{ width: 16, height: 16, margin: 10 }}
                    />
                    <Text>{clip.likes}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity onPress={this.onPressSignOut}>
              <Text>Sign out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    } else {
      return <View />;
    }
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    paddingTop: 17,
    fontSize: 20,
    color: '#393939',
    fontWeight: 'bold'
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    margin: 20
  },
  socialText: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  editProfile: {
    justifyContent: 'center',
    flexDirection: 'row'
  },
  editProfileText: {
    color: '#5D8586'
  },
  yourClipsHeader: {
    fontSize: 20,
    fontWeight: '500'
  },
  yourClipsContainer: {
    paddingTop: 40,
    paddingLeft: 30
  },
  clip: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 8,
    alignItems: 'center'
  },
  clipLeft: {
    flexDirection: 'row',
    marginRight: 60,
    alignItems: 'center'
  },
  clipName: {
    marginLeft: 20,
    width: 100
  },

  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
