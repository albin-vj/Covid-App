import React, {Component} from 'react';
import {View} from 'react-native';
import {Root} from 'native-base';
import {Progress} from './Progress';
export class MyRoot extends Component {
  render() {
    return (
      <View ref={(d) => (this._root = d)} {...this.props} style={{flex: 1}}>
        <Root>
          {this.props.children}
          <Progress />
        </Root>
      </View>
    );
  }
}
