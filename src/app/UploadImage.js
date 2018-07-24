import React, { Component } from 'react';
import { Text, View, ImagePickerIOS, Image, Button } from 'react-native';
import { v4 } from 'uuid';

export class UploadImage extends Component {
  constructor() {
    super();
    this.state = {
      image: null
    };
  }

  pickImage = () => {
    ImagePickerIOS.openSelectDialog(
      {},
      imageUri => {
        this.setState({ image: imageUri });
        console.log(this.state);
      },
      error => console.error(error)
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Button title="Pick Image" onPress={this.pickImage} />
        {this.state.image ? <Image style={{ flex: 1 }} source={{ uri: this.state.image }} /> : null}
      </View>
    );
  }
}
