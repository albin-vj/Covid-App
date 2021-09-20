import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../utils/AndroidBackButton';
import {Actions} from '../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import Commons from '../utils/Commons';
import {NBIcon as Icon, NBToast as Toast} from '../components/nativeBase';
import Colors from '../config/Colors';
import Strings from '../config/Strings';
import {AsyncStorages} from '../components/AsyncStorages';
import Assets from '../config/Assets';

const passref = React.createRef();
const mobref = React.createRef();

const Login = ({navigation}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [securePassword, setSecurePassword] = useState(true);
  const countryPrefix = '+91 ';
  /**
   *(check login status)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :17/09/21
   */
  const bindData = async () => {
    dispatch(Actions.showHideProgress());
    var mobileno = await AsyncStorages.getItem('mobile');
    var password = await AsyncStorages.getItem('pass');
    if (mobileno && password) {
      dispatch(
        Actions.setUserData({mobileNumber: mobileno, password: password}),
      );
      Commons.navigateToPage(navigation, 'Landing');
    }
    dispatch(Actions.showHideProgress());
  };
  useEffect(() => {
    bindData();

    handleAndroidBackButton(() => Commons.handleBackPress(navigation, true));
    return () => {
      removeAndroidBackButtonHandler();
    };
  }, []);
  /**
   *(login button)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :17/09/21
   */
  const loginAction = async () => {
    var status = await validation();
    if (status) {
      await AsyncStorages.setItem('mobile', mobileNo);
      await AsyncStorages.setItem('pass', password);
      clearCredentials();
      Commons.navigateToPage(navigation, 'Landing');
    }
  };
  /**
   *(login validation)
   *@param  :null
   *@return :boolean
   *@created by    :albin
   *@modified by   :albin
   *@modified date :17/09/21
   */
  const validation = () => {
    if (!mobileNo || mobileNo.length != 10 || isNaN(Number(mobileNo))) {
      Toast({text: 'Please enter valid mobile number', type: 'danger'});
      return;
    }
    if (!password || password.length < 6) {
      Toast({text: 'Please enter valid password', type: 'danger'});
      return;
    }
    return true;
  };
  /**
   *(to clear credentials)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :17/09/21
   */
  const clearCredentials = () => {
    setMobileNo('');
    setPassword('');
  };

  return (
    <View style={style.container}>
      <View style={{flex: 0.6, justifyContent: 'flex-end'}}>
        <View style={style.welcomeTextContainer}>
          <Text style={style.welcomeText}>{Strings.welcome}</Text>
          <Text style={style.welcomeText1}>{Strings.welcomeSubText}</Text>
        </View>
        <View style={style.SectionStyle}>
          {state?.showLabel ? (
            <View style={style.labelContainer}>
              <Text style={style.labelText}>{Strings.mobilePlaceholder}</Text>
            </View>
          ) : null}
          <Icon style={style.IconStyle} type="AntDesign" name={'mobile1'} />

          <TextInput
            style={{flex: 1}}
            placeholder={state?.showLabel ? '' : Strings.mobilePlaceholder}
            ref={mobref}
            underlineColorAndroid="transparent"
            maxLength={14}
            keyboardType="numeric"
            value={mobileNo ? countryPrefix + mobileNo : mobileNo}
            onChangeText={(text) => {
              text = text.startsWith(countryPrefix)
                ? text.split(countryPrefix)[1]
                : text;
              if (/^[0-9]+$/.test(text) || text == '') setMobileNo(text);
            }}
            onFocus={() => {
              if (state && !state.showLabel) dispatch(Actions.toggleLabel());
            }}
            onSubmitEditing={(text) => {
              passref?.current?.focus();
            }}
          />
        </View>
        <View style={style.SectionStyle}>
          {state?.showLabel ? (
            <View style={style.labelContainer}>
              <Text style={style.labelText}>{Strings.passwordPlaceHolder}</Text>
            </View>
          ) : null}
          <Icon
            style={style.IconStyle}
            type="MaterialCommunityIcons"
            name={'lock'}
          />

          <TextInput
            style={{flex: 1}}
            placeholder={state?.showLabel ? '' : Strings.passwordPlaceHolder}
            underlineColorAndroid="transparent"
            secureTextEntry={securePassword}
            ref={passref}
            value={password}
            maxLength={15}
            onChangeText={(text) => {
              setPassword(text.trim());
            }}
            onFocus={() => {
              if (state && !state.showLabel) dispatch(Actions.toggleLabel());
            }}
            onSubmitEditing={(text) => {
              if (mobileNo && password) loginAction();
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setSecurePassword(!securePassword);
            }}>
            {!securePassword ? (
              <Icon
                style={style.secureIcon}
                type="MaterialIcons"
                name={'visibility'}
              />
            ) : (
              <Icon
                style={style.secureIcon}
                type="MaterialIcons"
                name={'visibility-off'}
              />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={style.loginButton}
          onPress={() => {
            loginAction();
          }}>
          <View style={style.loginTextContainer}>
            <Text style={style.loginText}>{Strings.login}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 0.4, alignItems: 'center', justifyContent: 'center'}}>
        <ImageBackground
          resizeMode={'stretch'}
          style={[{height: '100%', width: '100%'}]}
          source={Assets.covid19}
        />
      </View>
    </View>
  );
};

Login.navigationOptions = {
  header: null,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.grey,
    borderRadius: 5,
    marginVertical: 20,
    marginHorizontal: 15,
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: '#FFF',
    top: -8,
    left: 25,
    paddingHorizontal: 5,
    zIndex: 50,
    fontSize: 10,
  },
  labelText: {color: Colors.grey, fontSize: 11},
  loginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    backgroundColor: Colors.blue,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 15,
  },
  welcomeTextContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '100%',
    paddingVertical: 20,
  },
  welcomeText: {
    color: Colors.grey,
    fontWeight: 'normal',
    fontSize: Dimensions.get('screen').width * 0.06,
  },
  welcomeText1: {
    color: Colors.grey,
    fontWeight: 'normal',
    fontSize: Dimensions.get('screen').width * 0.03,
  },
  loginTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },
  loginText: {
    color: Colors.white,
    fontWeight: 'normal',
    fontSize: Dimensions.get('screen').width * 0.04,
  },
  IconStyle: {
    color: Colors.black,
    fontSize: Dimensions.get('screen').width * 0.05,
    opacity: 1,
    paddingHorizontal: 10,
  },
  secureIcon: {
    color: Colors.black,
    fontSize: Dimensions.get('screen').width * 0.06,
    opacity: 0.1,
    paddingHorizontal: 5,
  },
});

export default Login;
