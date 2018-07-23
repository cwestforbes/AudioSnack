import React, { Component } from 'React';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { shape, array } from 'prop-types';

function FeedComments(props) {
  return (
    <View>
      {props.entry.comments.map((comment, index) => (
        <View key={index} style={styles.commentContainer}>
          <Text style={styles.user}>{comment.userName}</Text>
          <Text style={styles.userComment}>{comment.userComment}</Text>
        </View>
      ))}
    </View>
  );
}

FeedComments.propTypes = {
  entry: shape({
    comments: array
  })
};

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: 'row'
  },
  user: {
    fontWeight: 'bold'
  },
  userComment: {
    color: '#535353',
    fontWeight: '200',
    marginLeft: 10
  }
});

export default FeedComments;
