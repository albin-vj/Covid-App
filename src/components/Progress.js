import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';

//ProgressBar
export const Progress = (props) => {
  const {pro} = props;
  const state = useSelector((state) => state);

  return (
    <Modal
      animationType={'slide'}
      visible={state?.progress ?? false}
      transparent={true}
      presentationStyle={'overFullScreen'}>
      <View elevation={10} style={progressbarstyles.progressOuterContainer}>
        <View style={progressbarstyles.progressContainer}>
          <View style={progressbarstyles.progressInnerContainer}>
            <ActivityIndicator size="large" color={'#000000'} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const progressbarstyles = StyleSheet.create({
  progressOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Dimensions.get('window').width,
    overflow: 'visible',
    height: Dimensions.get('window').height,
  },
  progressInnerContainer: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
});
