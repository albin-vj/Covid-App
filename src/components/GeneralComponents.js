import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import Colors from '../config/Colors';
import {Tabs, Tab} from 'native-base';
import {NBIcon as Icon} from './nativeBase';

/**
 *(to use multiple tabs)
 *@param  :props
 *@return :view
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
export const UseTabs = (props) => {
  return <Tabs {...props} />;
};
/**
 *(to use tab)
 *@param  :props
 *@return :view
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
export const UseTab = (props) => {
  return <Tab {...props} />;
};

/**
 *(to use icon)
 *@param  :props
 *@return :icon
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
export const HeaderIcon = (props) => {
  return <Icon {...props} />;
};
/**
 *(single button popup)
 *@param  :props
 *@return :button view
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
export const SingleButtonPopup = (props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      presentationStyle={'overFullScreen'}
      onRequestClose={props.onClose}>
      <View style={{flex: 1}}>
        <TouchableOpacity style={props.buttonStyle} onPress={props.onPress}>
          <Text style={{color: Colors.black}}>{props.text ?? ''}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
