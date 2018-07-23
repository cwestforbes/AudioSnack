import React, { Component } from 'React';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { shape, number } from 'prop-types';

function FeedSocial(props) {
  return (
    <View style={styles.socialContainer}>
      <View style={styles.socialIconContainer}>
        <Image source={require('./../../public/img/like.png')} style={styles.socialImage} />
        <Text>{props.entry.likes > 1000 ? props.entry.likes / 1000 + 'k' : props.entry.likes} likes</Text>
      </View>
      <View style={styles.socialIconContainer}>
        <Image source={require('./../../public/img/comment.png')} style={styles.socialImage} />
        <Text>{props.entry.commentNumber > 1000 ? props.entry.commentNumber / 1000 + 'k' : props.entry.commentNumber} Comment</Text>
      </View>
      <View style={styles.socialIconContainer}>
        <Image source={require('./../../public/img/share.png')} style={styles.socialImage} />
        <Text>{props.entry.shares > 1000 ? props.entry.shares / 1000 + 'k' : props.entry.shares} shares</Text>
      </View>
    </View>
  );
}

FeedSocial.propTypes = {
  entry: shape({
    likes: number,
    commentNumber: number,
    shares: number
  })
};

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    height: 30,
    alignItems: 'center',
    marginBottom: 6
  },
  socialIconContainer: {
    flexDirection: 'row',
    marginRight: 16
  },
  socialImage: {
    marginRight: 10,
    height: 16,
    width: 16
  }
});

export default FeedSocial;
