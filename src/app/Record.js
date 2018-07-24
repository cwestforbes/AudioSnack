import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground, Text, TouchableOpacity, Alert } from 'react-native';
import Expo, {Asset, Audio, FileSystem, Permissions} from 'expo';
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
      alert('Audio Recording enabled');
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


  async prepareForUpload() {
    console.log('In prepare')
    this.setState({
      isLoading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      console.log('ERROR UNLOADING ASYNC')
    }
    const audioFile = await FileSystem.getInfoAsync(this.recording.getURI());
    await this.setState({
      recordingUri: audioFile.uri
    })
  }

  async uploadAudioFiles() {
    let audioName = v4();
    const response = await fetch(this.state.recordingUri);
    const blob = await response.blob();
    let storageRef = firebase.storage().ref().child(`clips/${audioName}`);
    storageRef.put(blob).then(result => {
      storageRef.getDownloadURL().then(audioUrl => {
        console.log('nested')
        let uid = firebase.auth().currentUser.uid;
        let clipsRef = firebase.database().ref(`clips/${uid}`);
        clipsRef.push({"audioUrl": audioUrl});
        alert('Success')
      },
      error => {
        Alert.alert(error.message);
      });
    });
  }



  render() {
    const timer = this.state.timerInMsElapsed - this.state.timerInMsStart;
    return (
      <View>
        <View>
          <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 62, fontWeight: '200', marginBottom: 100}}>{convertDurationToStr(timer)}
          </Text>
        </View>
        <Image source={require('./../../public/img/hold-waveform.png')} style={{ height: 200, width: 380 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, marginBottom: 30 }}>
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
                    this.onPressRecordButton();
                }}>
                  <ImageBackground source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{color: 'white', fontSize: 46, fontWeight: 'bold'}}>II</Text>
                  </ImageBackground>
                </TouchableOpacity>)}
          <TouchableOpacity >
            <Image source={require('./../../public/img/yesBtn.png')} style={{ height: 70, width: 70 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
