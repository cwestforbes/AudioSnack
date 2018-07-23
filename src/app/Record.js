import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';

export class Record extends Component {
  constructor() {
    super();
  }

  static navigationOptions = {
    tabBarLabel: 'Record',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/addRecordIcon.png')} style={{ width: 27, height: 27 }} />
  };


  render() {
    return (
      <View>
        <View>
          <Text style={{ marginTop: 60, textAlign: 'center', fontSize: 62, fontWeight: '200', marginBottom: 100 }}>0:00:00</Text>
        </View>
        <Image source={require('./../../public/img/hold-waveform.png')} style={{ height: 200, width: 380 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50, marginBottom: 30 }}>
          <Image source={require('./../../public/img/cancelBtn.png')} style={{ height: 70, width: 70 }} />
          <TouchableOpacity onPress={() => {alert('clicked')}}>
            <Image source={require('./../../public/img/recordBtn.png')} style={{ height: 90, width: 90 }} />
          </TouchableOpacity>
          <Image source={require('./../../public/img/yesBtn.png')} style={{ height: 70, width: 70 }} />
        </View>
      </View>
    );
  }
}
