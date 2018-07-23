import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground, Text, TouchableOpacity } from 'react-native';
import Expo, {Permissions} from 'expo';
import {duration} from 'moment';

const convertDurationToStr = (ms) => {
  const hoursInMs = duration(ms).hours();
  const minutesInMs = duration(ms).minutes();
  const secondsInMs = duration(ms).seconds();

  let hourStr = '';
  let minuteStr = '';
  let secondStr = '';

  if (hoursInMs !== 0) {
    hourStr = `${hoursInMs}`;
  }

  if (minutesInMs < 10) {
    minuteStr = `0${minutesInMs}`;
  } else {
    minuteStr = `${minutesInMs}`
  }

  if (secondsInMs < 10) {
    secondStr = `0${secondsInMs}`;
  } else {
    secondStr = `${secondsInMs}`
  }

  return `${hourStr}:${minuteStr}:${secondStr}`;
};

export class Record extends Component {
  constructor() {
    super();
    this.state = {
      isRecording: false
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

  render() {
    return (
      <View>
        <View>
          <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 62, fontWeight: '200', marginBottom: 100 }}>0:00:00</Text>
        </View>
        <Image source={require('./../../public/img/hold-waveform.png')} style={{ height: 200, width: 380 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, marginBottom: 30 }}>
          <Image source={require('./../../public/img/cancelBtn.png')} style={{ height: 70, width: 70 }} />
          {!this.state.isRecording ? (
            <TouchableOpacity
              onPress={() => {this.setState({
                isRecording: true});
                console.log(this.state);
              }}>
              <Image source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90 }} />
            </TouchableOpacity>
          ) : ( <TouchableOpacity
                  onPress={() => {this.setState({
                    isRecording: false});
                    alert('Recording Stopped')
                    console.log(this.state)
                }}>
                  <ImageBackground source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{color: 'white', fontSize: 46, fontWeight: 'bold'}}>II</Text>
                  </ImageBackground>
                </TouchableOpacity>)}
          <Image source={require('./../../public/img/yesBtn.png')} style={{ height: 70, width: 70 }} />
        </View>
      </View>
    );
  }
}
