import PropTypes from 'prop-types';
import React from 'react';
import {Dimensions, Keyboard} from 'react-native';
import {
  ActionSheet,
  Toast,
  Content,
  Item,
  Label,
  Input,
  Fab,
  Icon,
  Root,
  Container,
  Header,
  Footer,
  FooterTab,
  Button,
  Text,
} from 'native-base';

/*-----------------------------------------------------------------------------------------------------------//
                                              ICON
//-----------------------------------------------------------------------------------------------------------*/
const NBRoot = Root;
/*-----------------------------------------------------------------------------------------------------------//
                                              Toast
//-----------------------------------------------------------------------------------------------------------*/

const NBToast = (
  props = {
    text: '',
    buttonText: '',
    position: 'top' | 'bottom' | 'center',
    type: 'danger' | 'success' | 'warning',
    duration: 2000,
    style: {},
    onClose: (reason = 'user' | 'timeout' | 'functionCall') => any,
    textStyle: {},
    buttonTextStyle: {},
    buttonStyle: {},
  },
) => {
  const {
    text,
    textStyle,
    style,
    buttonText,
    buttonTextStyle,
    buttonStyle,
    position,
    type,
    duration,
    onClose,
  } = props;

  var options = {};
  if (text != undefined) options.text = text;
  else if (typeof props == 'string') options.text = props;
  else return;
  if (textStyle != undefined) options.textStyle = textStyle;
  if (buttonText == undefined) options.buttonText = 'x';
  else if (buttonText == '')
    options.textStyle = {textAlign: 'center', fontSize: 14};
  else options.buttonText = buttonText;
  if (style != undefined) options.style = style;
  else
    options.style = {
      margin: Dimensions.get('screen').width * 0.025,
      marginBottom: Dimensions.get('screen').width * 0.2,
      borderRadius: 5,
      elevation: 2,
    };

  if (buttonTextStyle != undefined) options.buttonTextStyle = buttonTextStyle;
  else
    options.buttonTextStyle = {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    };
  if (buttonStyle != undefined) options.buttonStyle = buttonStyle;
  if (position != undefined) options.position = position;
  else options.position = 'bottom';
  if (type != undefined) options.type = type;
  else options.type = 'success';
  if (duration != undefined) options.duration = Number(duration);
  else options.duration = 3000;
  if (onClose != undefined) options.onClose = onClose;

  Keyboard.dismiss();
  Toast.show(options);
};

/*-----------------------------------------------------------------------------------------------------------//
                                              ICON
//-----------------------------------------------------------------------------------------------------------*/
const NBIcon = (props) => {
  const {name, type, style, onPress, active, ios, android, color, fontSize} =
    props;
  return (
    <Icon
      name={name}
      type={type}
      style={style}
      fontSize={fontSize}
      android={android}
      ios={ios}
      color={color}
      onPress={onPress}
      active={active}
    />
  );
};
NBIcon.defaultProps = {
  name: 'Home',
  type: 'MaterialIcons',
  style: {color: 'blue', fontSize: 35},
  // onPress: (e) => {},
  active: false,
  color: 'blue',
};

NBIcon.propTypes = {
  name: PropTypes.string,
  type: PropTypes.oneOf([
    'MaterialIcons',
    'MaterialCommunityIcons',
    'AntDesign',
  ]),
  style: PropTypes.object,
  onPress: PropTypes.func,
  active: PropTypes.bool,
  ios: PropTypes.string,
  android: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.number,
};

export {NBIcon, NBToast, NBRoot};
