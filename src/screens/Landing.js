import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
} from '../utils/AndroidBackButton';
import Commons from '../utils/Commons';
import {
  UseTabs,
  UseTab,
  HeaderIcon,
  SingleButtonPopup,
} from '../components/GeneralComponents';
import Colors from '../config/Colors';
import Strings from '../config/Strings';
import {Dropdown} from '../components/Dropdown';
import {Actions} from '../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {GET_STATES, GET_DISTRICTS} from '../api/Api';
import Networkcall from '../api/Networkcall';
import {NBToast as Toast} from '../components/nativeBase';

const Landing = ({navigation}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [pincode, setPincode] = useState(state.selectedPincode);

  useEffect(() => {
    handleAndroidBackButton(() => Commons.handleBackPress(navigation, true));
    return () => {
      removeAndroidBackButtonHandler();
    };
  }, []);
  /**
   *(load states)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const loadStates = async () => {
    if (state?.states?.length == 0) {
      dispatch(Actions.showHideProgress());
      var states = await Networkcall.post(GET_STATES);
      await updateStates(states);
      dispatch(Actions.showHideProgress());
    }
  };
  /**
   *(update states)
   *@param  :api data
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const updateStates = (data) => {
    try {
      if (!data || !data.states) {
        Toast({text: 'Something went wrong', type: 'danger'});
        return;
      }
      var sts = [];
      data.states.filter(function (item) {
        sts.push({id: item.state_id, name: item.state_name});
        return item;
      });
      dispatch(Actions.SetStates(sts));
    } catch (err) {}
  };
  /**
   *(load districts)
   *@param  :selected state object
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const loadDistricts = async (item) => {
    if (
      item.id &&
      (state?.districts?.length == 0 ||
        !state.selectedDistrict.id ||
        item.id != state.selectedDistrict.id)
    ) {
      dispatch(Actions.showHideProgress());
      var districts = await Networkcall.post(GET_DISTRICTS + item.id);
      await updateDistricts(districts);
      dispatch(Actions.showHideProgress());
    }
  };
  /**
   *(update districts)
   *@param  :api data
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const updateDistricts = (data) => {
    try {
      if (!data || !data.districts) {
        Toast({text: 'Something went wrong', type: 'danger'});
        return;
      }
      var dts = [];
      data.districts.filter(function (item) {
        dts.push({id: item.district_id, name: item.district_name});
        return item;
      });
      dispatch(Actions.SetDistricts(dts));
    } catch (err) {}
  };
  /**
   *(logout popup)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  logoutPopup = () => {
    dispatch(Actions.toggleLogoutPopup());
  };
  /**
   *(logout button)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const logoutFunction = () => {
    Commons.logoutAction(navigation);
    logoutPopup();
  };
  /**
   *(change landing page tab)
   *@param  :tab index
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const changeTab = (tab) => {
    dispatch(Actions.toggleLandingTab(tab));
    if (tab == 1) loadStates();
  };
  /**
   *(validate and navigate to vaccine page)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  const searchVaccine = () => {
    try {
      if (state.landingPageTab == 0) {
        if (!state.selectedPincode) {
          Toast({text: 'Please enter pincode', type: 'danger'});
          return;
        }
        if (
          state.selectedPincode.length < 6 ||
          isNaN(Number(state.selectedPincode))
        ) {
          Toast({text: 'Please enter valid pincode', type: 'danger'});
          return;
        }
      } else if (state.landingPageTab == 1) {
        if (!state.selectedState || !state.selectedState.id) {
          Toast({text: 'Please select state', type: 'danger'});
          return;
        }
        if (!state.selectedDistrict || !state.selectedDistrict.id) {
          Toast({text: 'Please select district', type: 'danger'});
          return;
        }
      }
      Commons.navigateToPage(navigation, 'VaccineList');
    } catch (err) {}
  };

  return (
    <View style={style.container}>
      <UseTabs
        initialPage={state.landingPageTab ?? 0}
        onChangeTab={({i}) => {
          changeTab(i);
        }}
        tabBarUnderlineStyle={{backgroundColor: Colors.blue, borderRadius: 5}}>
        <UseTab
          heading={Strings.searchByPin}
          tabStyle={{backgroundColor: Colors.white}}
          textStyle={style.tabTextStyle}
          activeTabStyle={{backgroundColor: Colors.white}}
          activeTextStyle={style.tabTextStyle}>
          <View style={style.SectionStyle}>
            {state?.showLabel ? (
              <View style={style.labelContainer}>
                <Text style={style.labelText}>{Strings.pincode}</Text>
              </View>
            ) : null}
            <TextInput
              style={{flex: 1, marginLeft: 5}}
              placeholder={state?.showLabel ? '' : Strings.pincode}
              underlineColorAndroid="transparent"
              maxLength={6}
              keyboardType="numeric"
              value={pincode}
              onChangeText={(text) => {
                if (/^[0-9]+$/.test(text) || text == '') {
                  setPincode(text);
                  dispatch(Actions.selectPincode(text));
                }
              }}
              onFocus={() => {
                if (state && !state.showLabel) dispatch(Actions.toggleLabel());
              }}
              onSubmitEditing={(text) => {}}
            />
          </View>
        </UseTab>
        <UseTab
          heading={Strings.searchByDist}
          tabStyle={{backgroundColor: Colors.white}}
          textStyle={style.tabTextStyle}
          activeTabStyle={{backgroundColor: Colors.white}}
          activeTextStyle={style.tabTextStyle}>
          <View style={{marginVertical: 20, marginHorizontal: 15}}>
            {state?.showLabel ? (
              <View style={style.labelContainer}>
                <Text style={style.labelText}>{'State'}</Text>
              </View>
            ) : null}
            <Dropdown
              onItemSelect={(item) => {
                dispatch(Actions.selectState(item));
                loadDistricts(item);
              }}
              items={state?.states ?? []}
              textInputProps={{
                placeholder: state?.selectedState?.name
                  ? state?.selectedState?.name
                  : state?.showLabel
                  ? ''
                  : Strings.selectState,
                underlineColorAndroid: 'transparent',
                style: {
                  padding: 10,
                  borderWidth: 0.5,
                  borderColor: Colors.lightGrey,
                  borderRadius: 5,
                },
                // onTextChange: text =>{}
              }}
            />
          </View>
          <View style={{marginVertical: 20, marginHorizontal: 15}}>
            {state?.showLabel ? (
              <View style={style.labelContainer}>
                <Text style={style.labelText}>{'District'}</Text>
              </View>
            ) : null}
            <Dropdown
              onItemSelect={(item) => {
                dispatch(Actions.selectDistrict(item));
              }}
              items={state?.districts ?? []}
              textInputProps={{
                placeholder: state?.selectedDistrict?.name
                  ? state?.selectedDistrict?.name
                  : state?.showLabel
                  ? ''
                  : Strings.selectDistrict,
                underlineColorAndroid: 'transparent',
                style: {
                  padding: 10,
                  borderWidth: 0.5,
                  borderColor: Colors.lightGrey,
                  borderRadius: 5,
                },
                // onTextChange: text =>{}
              }}
            />
          </View>
        </UseTab>
      </UseTabs>
      <TouchableOpacity
        style={style.searchButton}
        onPress={() => {
          searchVaccine();
        }}>
        <View style={style.searchTextContainer}>
          <Text style={style.searchText}>{Strings.search}</Text>
        </View>
      </TouchableOpacity>
      <SingleButtonPopup
        text={'Logout'}
        visible={state.logoutButton}
        buttonStyle={style.singleButtonStyle}
        onPress={() => {
          logoutFunction();
        }}
        onClose={() => {
          dispatch(Actions.toggleLogoutPopup());
        }}
      />
    </View>
  );
};

Landing.navigationOptions = {
  // header: null,
  headerLeft: <View />,
  headerRight: (
    <TouchableOpacity
      style={{alignItems: 'center', justifyContent: 'center', marginRight: 5}}
      onPress={() => {
        logoutPopup();
      }}>
      <HeaderIcon
        style={{
          color: Colors.black,
          fontSize: Dimensions.get('screen').width * 0.07,
        }}
        name={'dots-vertical'}
        type={'MaterialCommunityIcons'}
      />
    </TouchableOpacity>
  ),
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabTextStyle: {
    color: Colors.black,
    fontSize: Dimensions.get('screen').width * 0.035,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.lightGrey,
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
  },
  labelText: {color: Colors.grey, fontSize: 11},
  searchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    backgroundColor: Colors.blue,
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  searchTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    paddingVertical: 15,
  },
  searchText: {
    color: Colors.white,
    fontWeight: 'normal',
    fontSize: Dimensions.get('screen').width * 0.04,
  },
  singleButtonStyle: {
    position: 'absolute',
    right: 15,
    top: Dimensions.get('screen').width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: Colors.lightGrey,
    elevation: 10,
    borderRadius: 5,
  },
});

export default Landing;
