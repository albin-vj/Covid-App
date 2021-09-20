import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Colors from '../config/Colors';

export const RNPicker = (props) => {
  lapsList = () => {
    return props.data.map((item, key) => {
      return <Picker.Item label={item.label} value={item.value} key={key} />;
    });
  };

  return (
    <View>
      <Picker {...props}>
        {props?.data?.length > 0 ? <>{lapsList()}</> : null}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 30,
    alignSelf: 'center',
    color: Colors.red,
  },
});
