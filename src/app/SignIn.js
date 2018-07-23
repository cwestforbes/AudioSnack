import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Button, TextInput, StatusBar, Alert } from 'react-native';
import * as firebase from 'firebase';

export class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      Password: ''
    };
  }

  onPressLogin() {
    console.log(this.state);
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.Email, this.state.Password)
      .then(
        () => {},
        error => {
          Alert.alert(error.message);
        }
      );
  }

  static navigationOptions = {
    headerLeft: null
  };

  render() {
    return (
      <View style={styles.signInContainer}>
        <Text style={styles.logo}>AudioApp</Text>
        <View style={{ marginTop: 10, width: 300 }}>
          <TextInput
            value={this.state.Email}
            onChangeText={input => this.setState({ Email: input })}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            style={{ width: 300, height: 40, borderWidth: 1, borderColor: '#9f9f9f', borderRadius: 3, marginBottom: 10, marginTop: 10, padding: 8 }}
          />
          <TextInput
            value={this.state.Password}
            onChangeText={input => this.setState({ Password: input })}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            style={{ width: 300, height: 40, borderWidth: 1, borderColor: '#9f9f9f', borderRadius: 3, padding: 8, marginBottom: 10 }}
          />
          <TouchableOpacity>
            <Text style={{ color: '#00a699', fontSize: 12, marginBottom: 10 }}>Forgot Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#00a699', padding: 10, alignItems: 'center', borderRadius: 3 }}
            onPress={() => this.onPressLogin()}
          >
            <Text style={{ color: 'white' }}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60 }}>
          <Text style={{ marginRight: 5 }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={{ color: '#00a699' }}>Sign up.</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  logo: {
    fontSize: 48,
    fontFamily: 'HelveticaNeue-CondensedBold',
    color: '#9f9f9f'
  },

  button: {
    marginTop: 15,
    backgroundColor: '#00a699',
    padding: 10,
    alignItems: 'center',
    borderRadius: 4
  }
});
