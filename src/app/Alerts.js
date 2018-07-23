import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, Image, Text } from 'react-native';
import { alerts } from './../../alertsData';

export class Alerts extends Component {
  static navigationOptions = {
    tabBarLabel: 'Alerts',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/alertIcon.png')} style={{ width: 25, height: 25 }} />
  };
  render() {
    return (
      <ScrollView>
        <View>
          <View style={styles.iosHeader} />
        </View>
        <View style={styles.header}>
          <Text style={styles.headerText}>Following</Text>
          <Text style={styles.headerText}>You</Text>
        </View>
        {alerts.map(alerts => (
          <View
            key={alerts.alert.id}
            style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e5e5e5', padding: 10 }}
          >
            <Image source={{ uri: `${alerts.alert.userImageUrl}` }} style={{ height: 55, width: 55, borderRadius: 55 / 2, marginRight: 15 }} />
            <Text style={{ fontWeight: 'bold', marginRight: 3 }}>{alerts.alert.user}</Text>
            <Text>{alerts.alert.action === 'like' ? 'likes your post' : 'has followed you'}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  iosHeader: {
    height: 32,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#f5f5f5',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'HelveticaNeue',
    color: '#9f9f9f'
  }
});
