import React, { Component } from 'react';
import { createBottomTabNavigator, createStackNavigator, NavigationActions } from 'react-navigation';
import { View, Text, Image, Button } from 'react-native';
import { Profile } from './src/app/Profile';
import { Search } from './src/app/Search';
import { Feed } from './src/app/Feed';
import { Alerts } from './src/app/Alerts';
import { Record } from './src/app/Record';
import { EditProfile } from './src/app/EditProfile';
import { BackBtn } from './src/app/BackBtn';
import { ProfileView } from './src/app/ProfileView';

const ProfileStack = createStackNavigator({
  Profile: { screen: Profile },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Button
          title="Cancel"
          onPress={() => {navigation.goBack();}}
        />
      )
    })
  }
});

const FindProfileStack = createStackNavigator({
  Search: {screen: Search,
    navigationOptions: ({ navigation }) => ({
      header: null
    })
  },
  ProfileView: {
    screen: ProfileView,
    navigationOptions: ({ navigation }) => ({
      headerLeft: (
        <Button
          title="Cancel"
          onPress={() => {navigation.goBack();}}
        />
      )
    })
  }
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ tintColor }) => <Image source={require('./public/img/profileIcon.png')} style={{ width: 25, height: 25 }} />
};

FindProfileStack.navigationOptions = {
  tabBarLabel: 'Search',
  tabBarIcon: ({ tintColor }) => <Image source={require('./public/img/searchIcon.png')} style={{ width: 25, height: 25 }} />
};

const MainScreenNavigator = createBottomTabNavigator(
  {
    Tab1: { screen: Feed },
    Tab2: { screen: Alerts },
    Tab3: { screen: Record },
    Tab4: { screen: ProfileStack },
    Tab5: { screen: FindProfileStack }
  },
  {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'grey'
    }
  }
);

createBottomTabNavigator.navigationOptions = {
  title: 'Tab example'
};

export default class MainNavigator extends React.Component {
  render() {
    return <MainScreenNavigator />;
  }
}
