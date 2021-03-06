import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ScrollView } from 'react-native';
import FeedComments from './FeedComments';
import FeedTitle from './FeedTitle';
import FeedSocial from './FeedSocial';

export class Feed extends Component {
  static navigationOptions = {
    tabBarLabel: 'Feed',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/homeIcon.png')} style={{ width: 27, height: 27 }} />
  };
  constructor(props) {
    super();
    this.state = {
      feed: []
    };
  }
  render() {
    return (
      <View>
        <View style={styles.iosHeader} />
        <View style={styles.header}>
          <Text style={styles.headerText}>AUDIOAPP</Text>
        </View>
        <ScrollView style={{ backgroundColor: 'white', paddingTop: 20, paddingBottom: 20 }}>
          {this.state.feed.map(entry => (
            <View key={entry.id} style={styles.feedContainer}>
              <FeedTitle entry={entry} />
              <Image source={require('./../../public/img/waveform.png')} style={{ width: 300, height: 20, marginBottom: 8 }} />
              <FeedSocial entry={entry} />
              <FeedComments entry={entry} />
            </View>
          ))}
        </ScrollView>
    </View>
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
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'HelveticaNeue-CondensedBold',
    color: '#9f9f9f'
  },
  feedContainer: {
    marginLeft: 16,
    marginBottom: 14
  }
});
