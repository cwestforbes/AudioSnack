import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Button, TextInput, ScrollView } from 'react-native';
import t from 'tcomb-form-native';
import _ from 'lodash';

const Form = t.form.Form;

const User = t.struct({
  name: t.String,
  email: t.String,
  website: t.String,
  bio: t.String
});

const stylesheet = _.cloneDeep(t.form.Form.stylesheet);

stylesheet.formGroup.normal.flexDirection = 'row';
stylesheet.formGroup.error.flexDirection = 'row';
stylesheet.formGroup.normal.alignItems = 'center';
stylesheet.formGroup.error.alignItems = 'center';
stylesheet.controlLabel.height = 300;
stylesheet.textboxView.normal.width = 250;
stylesheet.textbox.normal.width = 250;

const options = {
  stylesheet: stylesheet,
  auto: 'placeholders'
};

export class EditProfile extends Component {
  render() {
    return (
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jeff The Dog</Text>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://i.pinimg.com/originals/2f/a1/90/2fa190cfe9c61322584ed1f65d8cb94e.jpg' }}
            style={{ width: 128, height: 128, borderRadius: 128 / 2 }}
          />
        </View>
        <View style={styles.editImage}>
          <Button title="Edit Profile Image" color="#5D8586" />
        </View>
        <View
          style={{
            marginTop: 30,
            flex: 1,
            alignItems: 'center'
          }}
        >
          <Form type={User} options={options} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: 'white',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    paddingTop: 17,
    fontSize: 20,
    color: '#393939',
    fontWeight: 'bold'
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 170
  },
  inputFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1
  }
});
