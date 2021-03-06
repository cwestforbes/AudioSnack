import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground, Text, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import Expo, {Asset, ImageManipulator, Audio, FileSystem, Permissions, ImagePicker} from 'expo';
import {duration} from 'moment';
import { v4 } from 'uuid';
import * as firebase from 'firebase';

const convertDurationToStr = (ms) => {
  const minutesInMs = duration(ms).minutes();
  const secondsInMs = duration(ms).seconds();
  const msDuration =  duration(ms).milliseconds();
  let minuteStr = '';
  let secondStr = '';
  let centisecondStr = '';

  if (minutesInMs !== 0) {
    minuteStr = `0${minutesInMs}`;
  } else {
    minuteStr = `${minutesInMs}`
  }

  if (secondsInMs < 10) {
    secondStr = `0${secondsInMs}`;
  } else {
    secondStr = `${secondsInMs}`
  }

  if (msDuration < 100) {
    centisecondStr = `0${Math.floor(msDuration / 10)}`;
  } else {
    centisecondStr = `${Math.floor(msDuration / 10)}`;
  }

  return `${minuteStr}:${secondStr}.${centisecondStr}`;
};


export class Record extends Component {
  constructor(props) {
    super(props);
    this.recording = null,
    this.sound = null,
    this.state = {
      isLoading: false,
      isRecording: false,
      timerInMsStart: 0,
      timerInMsElapsed: 0,
      isReadyToUpload: false,
      recordingUri: null,
      isReadyToUpload: false,
      coverUri: null,
      clipTitle: ''
    }
  }

  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/addRecordIcon.png')} style={{ width: 27, height: 27 }} />
  };

  componentDidMount() {
    this.getRecordPermissions();
  }

  getRecordPermissions = async () => {
    const { Permissions } = Expo;
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
      console.log('Audio Recording enabled');
    }
  }

  componentWillUnmount() {
    clearInterval(this.timeTicker)
  }

  toggleTimer = () => {
    if (!this.state.isRecording) {
      this.setState({isRecording: true})
      this.startTimer();
    } else {
      this.setState({isRecording: false})
      this.stopTimer();
    }
  }

  startTimer = () => {
    const timerInMsElapsed = new Date().getTime();
    this.setState({
      timerInMsStart: timerInMsElapsed,
      timerInMsElapsed
    });
    this.timeTicker = setInterval(() => {
      this.setState({ timerInMsElapsed: new Date().getTime()});
    }, 1)
  }

  stopTimer = () => {
    clearInterval(this.timeTicker);
    this.setState({timerInMs: 0})
  }


  updateAppForRecording = status => {
    if(status.canRecord) {
      this.setState({
        isRecording: status.IsRecording
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false
      });
    } if (!this.state.isLoading) {
        this.prepareForUpload()
      }
  }
  // Thanks to https://github.com/expo/audio-recording-example/blob/master/App.js for code

  startRecording  = async () => {
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this.updateScreenForRecording);

    this.recording = recording;
    await this.recording.startAsync()
    this.setState({
      isLoading: false
    })
  }

  onPressRecordButton = () => {
    if (this.state.isRecording) {
      this.prepareForUpload();
    } else {
      this.startRecording();
    }
  }


   prepareForUpload = async () => {
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log('ERROR UNLOADING ASYNC')
    }
    const audioFile = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(audioFile);

    await this.setState({
      recordingUri: audioFile.uri
    })
  }

  uploadAudioFiles = async() => {
    let audioName = v4();
    const response = await fetch(this.state.recordingUri);
    const blob = await response.blob();
    let storageRef = firebase.storage().ref().child(`clips/${audioName}.caf`);
    storageRef.put(blob).then(result => {
      storageRef.getDownloadURL().then(audioUrl => {
        let uid = firebase.auth().currentUser.uid;
        let clipsRef = firebase.database().ref(`clips/${uid}`);
        let values = {"coverArtUrl": this.state.coverUri, "clipAudioFileUrl": audioUrl, "clipTitle": this.state.clipTitle }
        clipsRef.push(values);
        this.recordPageReset();
      },
      error => {
        Alert.alert(error.message);
      });
    });
  }

  pickImage = async() => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
        await this.setState({ coverUri: result.uri });
        this.uploadCoverArt();
    } else {
      Alert.alert(error);
    }
  };

  uploadCoverArt = async() => {
    let coverArtId = v4();
    const compressedImage = await this.coverArtImageCompress(this.state.coverUri);
    const response = await fetch(compressedImage);
    const blob = await response.blob();
    let storageRef = firebase.storage().ref().child(`coverArt/${coverArtId}`);
    storageRef.put(blob).then(result => {
      storageRef.getDownloadURL().then(coverArtUrl => {
        this.setState({
          coverUri: coverArtUrl
        })
        console.log('success')
      },
      error => {
        Alert.alert(error.message);
      });
    });
  }

  recordPageReset = () => {
    this.setState({
      recordingUri: null,
      coverUri: null,
      clipTitle: '',
      isReadyToUpload: false,
      timerInMsStart: 0,
      timerInMsElapsed: 0,
    })
  }

  coverArtImageCompress = async img => {
    const compressedImg = await ImageManipulator.manipulate(img, [{resize: {height: 75}}], {compress: 0.7, base64: undefined});
    return compressedImg.uri;
  }


  render() {
    const timer = this.state.timerInMsElapsed - this.state.timerInMsStart;
    if (!this.state.isReadyToUpload && !this.state.recordingUri) {
      return (
        <View>
          <View>
            <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 62, fontWeight: '200', marginBottom: 60}}>{convertDurationToStr(timer)}
            </Text>
          </View>
          <Image source={require('./../../public/img/hold-waveform.jpg')} style={{ height: 200, width: 380 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 30 }}>
            <Image source={require('./../../public/img/cancelBtn.png')} style={{ height: 70, width: 70 }} />
            {!this.state.isRecording ? (
              <TouchableOpacity
                onPress={() => {
                  this.toggleTimer();
                  this.onPressRecordButton();
                }}>
                <Image source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90 }} />
              </TouchableOpacity>
            ) : ( <TouchableOpacity
              onPress={() => {
                this.toggleTimer();
              }}>
              <ImageBackground source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{color: 'white', fontSize: 46, fontWeight: 'bold'}}>II</Text>
              </ImageBackground>
            </TouchableOpacity>)}
            <TouchableOpacity onPress={() => {
                this.setState({
                  isReadyToUpload: true
                });
                this.prepareForUpload();
              }}>
              <Image source={require('./../../public/img/yesBtn.png')} style={{ height: 70, width: 70 }} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 }}>
            <TouchableOpacity  onPress={this.pickImage}>
              {this.state.coverUri ? (
                <Image style={{ width: 75, height: 75, marginBottom: 20}} source={{ uri: this.state.coverUri }} />
              ) : (
                <View style={{ width: 75, height: 75, borderWidth: 1, marginBottom: 20 }} />
              )}
            </TouchableOpacity>
            <View>

              <TextInput
                value={this.state.clipTitle}
                onChangeText={input => {
                  this.setState({ clipTitle: input });
                  console.log(this.state);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                style={{paddingLeft: 8, width: 180, height: 30, marginBottom: 20 }}
                placeholder="Add a title" />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.uploadAudioFiles();
                this.props.navigation.navigate('Profile')
              }}>
              <Text style={{color: 'white'}}>Share</Text>
            </TouchableOpacity>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#00a699',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4,
    width: '68%',
  }
});
