import React, { Component } from 'react';
import { View, StyleSheet, Image, TextInput, Text, ScrollView, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';


export class Search extends Component {
  static navigationOptions = {
    tabBarLabel: 'Search',
    tabBarIcon: ({ tintColor }) => <Image source={require('./../../public/img/searchIcon.png')} style={{ width: 25, height: 25 }} />
  };

  constructor(props) {
    super(props);
    this.state = {
      search: null,
      searchResults: null,
      clickeduserId: null
    }
  }

  componentDidMount() {
    this.fetchUsersFromSearch()
  }

  fetchUsersFromSearch = () => {
    const getUsersObj = firebase.database().ref('/users');
    getUsersObj.on('value', snapshot => {
      this.updateSearchResultsState(snapshot.val());
    });
  }

  updateSearchResultsState = snapshot => {
    let dataWithId = Object.values(snapshot).map((el) => {
      return el;
    })
    this.setState({
      searchResults: dataWithId
    })
  }

  lookUp = mailVal => {
    const ref = firebase.database().ref('users');
    ref.orderByChild("email").equalTo(mailVal).on("child_added", snapshot => {
      this.setState({
        clickeduserId: snapshot.key,
      });
    });
  }

  render() {
    return (
      <View style={{backgroundColor: 'white'}}>
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
                   this.setState({ search: input });
                 }}
                 value={this.state.search}
              />
            </View>
          </View>
        </View>
        <ScrollView style={{backgroundColor:'white', height: '100%'}}>
          <View style={{width: '100%', backgroundColor: 'white', height: '100%'}}>
            {(this.state.search === null || this.state.search === '') ? null : this.state.searchResults
              .filter(
               user =>`${user.username}`.toLowerCase().indexOf((this.state.search).toLowerCase()) >= 0)
              .map((user, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={async () => {
                    await this.lookUp(user.email);
                    this.props.navigation.navigate('ProfileView', {
                      userID: this.state.clickeduserId,
                    })
                  }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e5e5e5', padding: 10 }}>
                    <Image source={{ uri: `${user.profileImageUrl}` }} style={{ height: 55, width: 55, borderRadius: 55 / 2, marginRight: 12 }} />
                    <Text style={{ fontWeight: 'bold' }}>{user.username}</Text>
                  </View>
              </TouchableOpacity>
            ))}
          </View>
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
