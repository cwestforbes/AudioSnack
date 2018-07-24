import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TextInput } from 'react-native';

export class Search extends Component {
  static navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/searchIcon.png')} style={{ width: 25, height: 25 }} />
  };

  constructor(props) {
    super(props);
    this.state = {
      search: ''
    }
  }
  render() {
    return (
      <View>
        <View style={styles.iosHeader} />
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <View style={styles.searchContents}>
              <View style={styles.imgContainer}>
                <Image source={require('./../../public/img/search.png')} style={{ width: 15, height: 15, padding: 10 }} />
              </View>
              <TextInput
                 style={styles.input}
                 placeholder="Search for user"
                 autoCapitalize="none"
                 autoCorrect={false}
                 onChangeText={input => {
                   this.setState({search: input})
                 }}
                 value={this.state.search}
              />
            </View>
          </View>
        </View>
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
  searchHeader: {
    height: 65,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    height: 34,
    width: '90%',
    backgroundColor: '#E5E5E5',
    borderRadius: 3
  },
  searchContents: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    paddingLeft: 8,
    flexDirection: 'row'
  },
  input: {
    marginLeft: 7,
    height: 29,
    width: 270,
    fontSize: 16
  }
});
