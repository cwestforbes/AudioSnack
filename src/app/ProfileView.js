import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Button, ScrollView, Alert } from 'react-native';
// import { clips } from './../../clipData.json';
import Expo, {Asset, Audio, FileSystem} from 'expo';
import * as firebase from 'firebase';





export class ProfileView extends Component {
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
      clips: [],
      isFollowing: false,
    };
  }

  updateProfile = (_username, _email, _imageUrl) => {
    this.setState({
      username: _username,
      email: _email,
      profileImgUrl: _imageUrl,
      fetchIsReady: true
    })
  };

  checkIfUserIsLoggedIn(propUser) {
    const currentUser = firebase.auth().currentUser.uid;
    let userId;
    userId = currentUser === propUser ? currentUser : propUser;
    return firebase
      .database()
      .ref('/users/' + userId)
      .once('value')
      .then(
        snapshot => {
          let usernameData = (snapshot.val() && snapshot.val().username) || 'Anonymous';
          let emailData = (snapshot.val() && snapshot.val().email) || 'Anonymous';
          let imgData = (snapshot.val() && snapshot.val().profileImageUrl) || 'File not found';
          if (usernameData && emailData && imgData) {
            this.updateProfile(usernameData, emailData, imgData);
            // this.downloadImgData(imgData)
          }
        },
        error => {
          Alert.alert(error.message);
        }
      );
  }

  checkUserClips(propUser) {
    const currentUser = firebase.auth().currentUser.uid;
    let userId;
    userId = currentUser === propUser ? currentUser : propUser;
    let userClips = firebase.database().ref('/clips/' + userId);
    if (userClips) {
      console.log('You have clips!');
      userClips.on('value', snapshot => {
        this.updateClipsState(snapshot.val())
      });
    } else {
      console.log('you don\'t have clips' )
    }
  }

  updateClipsState = async snapshot => {
    let fetchedClipsArr = [];
    for (keys in snapshot) {
      let clipsObjs = snapshot[keys]
      fetchedClipsArr.push(clipsObjs);
    }
    await this.setState({
      clips: fetchedClipsArr,
      fetchIsReady: true
    })
  }


  componentDidMount() {
    const uId = this.props.navigation.getParam('userID');
    this.checkUserClips(uId)
  }

  onPressPlayClip = async (audio) => {
    const soundObject = new Expo.Audio.Sound();
    try {
      await soundObject.loadAsync({uri: audio});
      await soundObject.playAsync();
      // Your sound is playing!
    } catch (error) {
      // An error occurred!
    }
  }

  handleFollow = () => {
    console.log('Follow user')
    if (!this.props.navigation.getParam('userID')) {
      alert('error')
    }

    if (!this.state.isFollowing) {
      let userId = this.props.navigation.getParam('userID');
      let currentLoggedInUser = firebase.auth().currentUser.uid;
      let ref = firebase.database().ref().child(`following/${currentLoggedInUser}`)
      let setValues = {};
      setValues[userId] = 1
      ref.update(setValues)
      .then(
        () => {
          console.log('following ')
        },
        error => {
          Alert.alert(error.message);
        }
      );
      this.setState({
        isFollowing: true
      })
    } else {
      if (ref === undefined) {
        console.log('error')
      }
      let userId = this.props.navigation.getParam('userID');
      let currentLoggedInUser = firebase.auth().currentUser.uid;
      let ref = firebase.database().ref().child(`following/${currentLoggedInUser}/${userId}`);
      ref.remove();
      this.setState({
        isFollowing: false
      })
    }

  }

  render() {
    const {navigation} = this.props;
    const userName = navigation.getParam('user', 'no user found')
    const userProfileImage = navigation.getParam('userImage', 'no user found');
    console.log(userProfileImage);
    if (this.state.fetchIsReady) {
      return (
        <ScrollView style={{ backgroundColor: 'white' }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{userName}</Text>
          </View>
          <View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: userProfileImage }} style={{ width: 128, height: 128, borderRadius: 128 / 2 }} />
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
                <Text>{this.state.clips.length}</Text>
                <Text>{this.state.clips.length === 1 ? 'Clip' : 'Clips'}</Text>
              </View>
            </View>
            <View style={styles.editProfile}>
              <TouchableOpacity onPress={this.handleFollow} style={{ backgroundColor: '#00a699', padding: 10, alignItems: 'center',borderRadius: 4}}>
                {!this.state.isFollowing ? (
                  <Text style={{color: 'white'}}>Follow</Text>
                ) : (
                  <Text style={{color: 'white'}}>Unfollow</Text>
                )
              }
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.yourClipsContainer}>
            <Text style={styles.yourClipsHeader}>Clips</Text>
            <View>
              {this.state.clips.map((clip, index) => (
                <View style={styles.clip} key={index}>
                  <View style={styles.clipLeft}>
                    <TouchableOpacity
                      onPress={() => {this.onPressPlayClip(clip.clipAudioFileUrl)}}>
                      <Image source={{ uri: `${userProfileImage}` }} style={{ height: 50, width: 50 }} />
                    </TouchableOpacity>
                    <Text style={styles.clipName}>{clip.clipTitle}</Text>
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
