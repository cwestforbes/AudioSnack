import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground, Text, TouchableOpacity } from 'react-native';
import Expo, {Permissions} from 'expo';
import {duration} from 'moment';

const convertDurationToStr = (ms) => {
  const minutesInMs = duration(ms).minutes();
  const secondsInMs = duration(ms).seconds();
  const msDuration = duration(ms).milliseconds();

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
    this.state = {
      isRecording: false,
      timerInMsStart: 0,
      timerInMsElapsed: 0,
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

  startTimer = () => {
    const currentStart = new Date().getTime();
    this.setState({
      timerInMsStart: currentStart,
    });
    this.timeTicker = setInterval(() => {
      this.setState({ timerInMsElapsed: new Date().getTime()});
    }, 10)
  }

  stopTimer = () => {
    clearInterval(this.timeTicker);
    this.setState({timerInMs: 0})
  }

  onPressStartCounter = async () => {
    await this.setState({
      isRecording: true
    });
    if (this.state.isRecording) {
      setInterval(() => {
        this.countUpTimer();
      }, 1)
    } else {
      console.log('noper')
    }
  };

  render() {
    return (
      <View>
        <View>
          <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 62, fontWeight: '200', marginBottom: 100}}>{convertDurationToStr((this.state.timerInMsElapsed - this.state.timerInMsStart))}
          </Text>
        </View>
        <Image source={require('./../../public/img/hold-waveform.png')} style={{ height: 200, width: 380 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, marginBottom: 30 }}>
          <Image source={require('./../../public/img/cancelBtn.png')} style={{ height: 70, width: 70 }} />
          {!this.state.isRecording ? (
            <TouchableOpacity
              onPress={() => {
                this.startTimer();

              }}>
              <Image source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90 }} />
            </TouchableOpacity>
          ) : ( <TouchableOpacity
                  onPress={() => {
                    this.stopTimer();
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
