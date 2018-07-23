import React, { Component } from 'React';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { shape, string, number } from 'prop-types';

function FeedTitle(props) {
  return (
    <View style={styles.feedTitleContainer}>
      <Image
        source={{ uri: `${props.entry.imageUrl}` }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 60 / 2,
          marginRight: 15
        }}
      />
      <View>
        <View style={styles.feedTitleUser}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#9F9F9F',
              marginRight: 8
            }}
          >
            {props.entry.userName}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '200',
              color: '#9F9F9F'
            }}
          >
            &bull; {props.entry.postTime}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8, color: '#9F9F9F' }}>{props.entry.postTitle}</Text>
          <Text style={{ color: '#9F9F9F' }}> {props.entry.listens > 1000 ? props.entry.listens / 1000 + 'k' : props.entry.listens} listens</Text>
        </View>
      </View>
    </View>
  );
}

FeedTitle.propTypes = {
  entry: shape({
    imageUrl: string,
    userName: string,
    postTime: string,
    postTitle: string,
    listens: number
  })
};

const styles = StyleSheet.create({
  feedTitleContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  feedTitleUser: {
    flexDirection: 'row'
  }
});

export default FeedTitle;
