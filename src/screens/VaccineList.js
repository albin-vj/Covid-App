import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
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
import {Actions} from '../redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {GET_VACCINE_BY_DISTRICT, GET_VACCINE_BY_PINCODE} from '../api/Api';
import Networkcall from '../api/Networkcall';
import {NBToast as Toast} from '../components/nativeBase';
import RecycleTestComponent from '../components/RecyclerView';

let page_header = 'Change Location';
const VaccineList = ({navigation}) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const [pincode, setPincode] = useState('');
  const useRecyclerView = true;
  page_header =
    state.landingPageTab == 0
      ? state.selectedPincode
      : state.selectedDistrict.name;

  useEffect(() => {
    loadVaccine();

    handleAndroidBackButton(() => backButtonPress());
    return () => {
      removeAndroidBackButtonHandler();
    };
  }, []);
  /**
   *(load vaccine data)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const loadVaccine = async () => {
    //pincode search
    dispatch(Actions.SetVaccineCopy([]));
    dispatch(Actions.SetVaccine([]));
    if (state.landingPageTab == 0) {
      if (state.selectedPincode) {
        var appendurl =
          GET_VACCINE_BY_PINCODE +
          state.selectedPincode +
          '&date=' +
          Commons.getDate();
        fetchData(appendurl);
      }
    }
    //district search
    if (state.landingPageTab == 1) {
      if (state.selectedDistrict.id) {
        var appendurl =
          GET_VACCINE_BY_DISTRICT +
          state.selectedDistrict.id +
          '&date=' +
          Commons.getDate();
        fetchData(appendurl);
      }
    }
  };
  /**
   *(load vaccine data api call)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const fetchData = async (url) => {
    dispatch(Actions.showHideProgress());
    var vaccines = await Networkcall.post(url);
    await updateVaccineList(vaccines);
    dispatch(Actions.showHideProgress());
  };
  /**
   *(update vaccine data)
   *@param  :api data
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const updateVaccineList = (data) => {
    try {
      if (state.landingPageTab == 1) {
        if (!data || !data.centers) {
          Toast({text: 'Something went wrong', type: 'danger'});
          return;
        }
        updateVaccineByDistrict(data);
      }
      if (state.landingPageTab == 0) {
        if (!data || !data.sessions) {
          Toast({text: 'Something went wrong', type: 'danger'});
          return;
        }
        updateVaccineByPincode(data);
      }
    } catch (err) {}
  };
  /**
   *(update vaccine data by pincode)
   *@param  :data
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const updateVaccineByPincode = async (data) => {
    try {
      var vcs = [];
      var obj = await getSessionData(data.sessions, {});
      if (obj && obj.id) vcs.push(obj);
      dispatch(Actions.SetVaccineCopy(vcs));
      applyFilter(vcs);
    } catch (err) {}
  };
  /**
   *(update vaccine data by district)
   *@param  :data
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const updateVaccineByDistrict = async (data) => {
    try {
      var vcs = [];
      await data.centers.filter(async function (item, index) {
        var obj = {
          id: item.center_id,
          key: index,
          name: item.name,
          address: item.address,
          fee_Type: item.fee_type,
        };
        obj = await getSessionData(item.sessions, obj);
        if (obj && obj.id) vcs.push(obj);
        return item;
      });
      dispatch(Actions.SetVaccineCopy(vcs));
      applyFilter(vcs);
    } catch (err) {}
  };
  /**
   *(format sesion data from vaccine list)
   *@param  :session data,format object
   *@return :formatted object
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const getSessionData = (sessions, obj) => {
    try {
      var vaccineobjdose1 = {};
      var vaccineobjdose2 = {};
      var minage = '';
      var allowall = false;
      var date = '';
      if (sessions) {
        sessions.filter(function (item1) {
          if (obj.minage == undefined) minage = item1.min_age_limit;
          if (obj.allowall == undefined)
            allowall = item1.allow_all_age ?? false;
          if (obj.date == undefined) date = item1.date ?? '';
          if (obj.fee_Type == undefined) obj['fee_Type'] = item1.fee_type ?? '';
          if (obj.id == undefined) obj['id'] = item1.center_id ?? '';
          if (obj.name == undefined) obj['name'] = item1.name ?? '';
          if (obj.address == undefined) obj['address'] = item1.address ?? '';
          if (vaccineobjdose1[item1.vaccine])
            vaccineobjdose1[item1.vaccine] +=
              item1.available_capacity_dose1 ?? 0;
          else
            vaccineobjdose1[item1.vaccine] =
              item1.available_capacity_dose1 ?? 0;
          if (vaccineobjdose2[item1.vaccine])
            vaccineobjdose2[item1.vaccine] +=
              item1.available_capacity_dose2 ?? 0;
          else
            vaccineobjdose2[item1.vaccine] =
              item1.available_capacity_dose2 ?? 0;
          return item1;
        });
        return {
          ...obj,
          vaccineobjdose1,
          vaccineobjdose2,
          minage,
          allowall,
          date,
        };
      }
    } catch (err) {
      return false;
    }
  };
  /**
   *(apply filter in vaccine data)
   *@param  :data,vaccine page tab
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const applyFilter = async (data, tab) => {
    try {
      // {"18+":false,"45+":false,Free:false,Paid:false,"First Dose":false}
      if (data) {
        tab = tab ?? state.vaccinePageTab;
        data = data.filter(function (item, index1) {
          var flag = true;
          var count = 0;
          var flag1 = true;
          var flag2 = true;
          Object.keys(state.vaccineFilters).filter(function (item1) {
            if (state.vaccineFilters[item1]) {
              if (item1 == 'First Dose') return;
              if (count == 0) {
                flag1 = false;
                flag2 = false;
                flag = flag1 && flag2;
              }
              count++;
              if (item1 == '18+') {
                if (item.minage >= 18 || item.allowall) flag1 = true;
                else flag1 = false;
                flag = flag1 || flag2;
              }
              if (item1 == '45+') {
                if (item.minage >= 45 || item.allowall) flag2 = true;
                else flag2 = false;
                flag = flag1 || flag2;
              }
              flag1 = false;
              flag2 = false;
              if (item1 == 'Free') {
                if (item.fee_Type == 'Free') flag1 = true;
                else flag1 = false;
                flag = flag1 || flag2;
              }
              if (item1 == 'Paid') {
                if (item.fee_Type == 'Paid') flag2 = true;
                else flag2 = false;
                flag = flag1 || flag2;
              }
            }
            return;
          });
          if (tab == 0 && item.date != Commons.getDate()) flag = false;
          if (flag) return item;
        });
        dispatch(Actions.SetVaccine(data));
      }
    } catch (err) {
      alert(err);
      dispatch(Actions.SetVaccine(data));
    }
  };
  /**
   *(update filter)
   *@param  :filter
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const filterUpdate = (item) => {
    var filters = state.vaccineFilters;
    filters[item] = !state.vaccineFilters[item];
    dispatch(Actions.SetVaccineFilters(filters));
    applyFilter(state.vaccineCopy);
  };
  /**
   *(cange vaccine page tab)
   *@param  :tab index
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const changeTab = async (tab) => {
    dispatch(Actions.showHideProgress());
    dispatch(Actions.toggleVaccineTab(tab));
    await applyFilter(state.vaccineCopy, tab);
    dispatch(Actions.showHideProgress());
  };
  /**
   *(logout popup)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
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
   *@modified date :19/09/21
   */
  const logoutFunction = () => {
    Commons.logoutAction(navigation);
    logoutPopup();
  };
  /**
   *(back button)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  backButtonPress = () => {
    Commons.handleBackPress(navigation);
  };
  /**
   *(reload vaccine data)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const onRefresh = React.useCallback(() => {
    loadVaccine();
  }, []);
  /**
   *(empty list view)
   *@param  :null
   *@return :view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const EmptyListItem = () => {
    return !state.progress ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/* <Image style={[{ height:Dimensions.get("screen").width*0.4,width:Dimensions.get("screen").width*0.4,borderRadius:Dimensions.get("screen").width*0.2,opacity:0.25}]} 
            source={} /> */}

        <Text
          style={{
            color: Colors.darkGray,
            fontSize: Dimensions.get('screen').width * 0.04,
          }}>
          {'No centers available!'}
        </Text>
      </View>
    ) : null;
  };
  /**
   *(vaccine item view)
   *@param  :Item
   *@return :view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const VaccineItemList = ({Item}) => {
    return (
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'center',
          borderRadius: 10,
          marginHorizontal: 15,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: 10,
            paddingHorizontal: 20,
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: Colors.black,
              fontSize: Dimensions.get('screen').width * 0.04,
              paddingVertical: 5,
            }}>
            {Item.name ?? ''}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: Colors.grey,
              fontSize: Dimensions.get('screen').width * 0.02,
            }}>
            {Item.name ?? ''}
          </Text>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginVertical: 5,
            }}>
            {Object.keys(
              state.vaccineFilters['First Dose']
                ? Item.vaccineobjdose1
                : Item.vaccineobjdose2,
            ).map((obj, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  paddingVertical: 3,
                  marginHorizontal: 2,
                  borderRadius: 1,
                  elevation: 0,
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: state.vaccineFilters['First Dose']
                      ? Item.vaccineobjdose1[obj] <= 10
                        ? Colors.red
                        : Colors.green
                      : Item.vaccineobjdose2[obj] <= 10
                      ? Colors.red
                      : Colors.green,
                    borderRadius: 8,
                    width: 50,
                  }}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: Dimensions.get('screen').width * 0.035,
                      padding: 5,
                    }}>
                    {state.vaccineFilters['First Dose']
                      ? Item.vaccineobjdose1[obj]
                      : Item.vaccineobjdose2[obj]}
                  </Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontSize: Dimensions.get('screen').width * 0.035,
                      padding: 5,
                    }}>
                    {obj}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };
  /**
   *(tab view)
   *@param  :null
   *@return :tab view
   *@created by    :albin
   *@modified by   :albin
   *@modified date :19/09/21
   */
  const TabItem = () => {
    return (
      <View style={{backgroundColor: Colors.lightGrey, flex: 1}}>
        {state.vaccineFilters ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              margin: 15,
            }}>
            {Object.keys(state.vaccineFilters).map((filteritem, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  paddingVertical: 3,
                  marginHorizontal: 2,
                  borderRadius: 1,
                  backgroundColor: state.vaccineFilters[filteritem]
                    ? Colors.grey
                    : Colors.white,
                  elevation: 0,
                  width: 100 / Object.keys(state.vaccineFilters).length + '%',
                  borderRadius: 8,
                }}
                onPress={() => {
                  filterUpdate(filteritem, index);
                }}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Text
                    style={{
                      color: state.vaccineFilters[filteritem]
                        ? Colors.white
                        : Colors.grey,
                      fontSize: Dimensions.get('screen').width * 0.03,
                    }}>
                    {filteritem}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
        {useRecyclerView ? (
          <>
            {state.vaccine?.length > 0 ? (
              <RecycleTestComponent
                height={Dimensions.get('screen').width * 0.4}
                bottommargin={Dimensions.get('screen').width * 0.05}
                data={state.vaccine}
                renderView={({data, index}) => (
                  <VaccineItemList Item={data} Index={index} />
                )}
                onRefresh={onRefresh}></RecycleTestComponent>
            ) : (
              EmptyListItem()
            )}
          </>
        ) : null}
      </View>
    );
  };
  return (
    <View style={style.container}>
      <UseTabs
        initialPage={0}
        onChangeTab={({i}) => {
          changeTab(i);
        }}
        tabBarUnderlineStyle={{backgroundColor: Colors.blue, borderRadius: 5}}>
        <UseTab
          heading={Strings.today}
          tabStyle={{backgroundColor: Colors.white}}
          textStyle={style.tabTextStyle}
          activeTabStyle={{backgroundColor: Colors.white}}
          activeTextStyle={style.tabTextStyle}>
          <TabItem />
        </UseTab>
        <UseTab
          heading={Strings.thisWeek}
          tabStyle={{backgroundColor: Colors.white}}
          textStyle={style.tabTextStyle}
          activeTabStyle={{backgroundColor: Colors.white}}
          activeTextStyle={style.tabTextStyle}>
          <TabItem />
        </UseTab>
      </UseTabs>
      <TouchableOpacity style={style.searchButton} onPress={() => {}}>
        <View style={style.searchTextContainer}>
          <Text style={style.searchText}>{Strings.notify}</Text>
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

VaccineList.navigationOptions = {
  // header: null,
  headerLeft: (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        flexDirection: 'row',
      }}
      onPress={() => {
        backButtonPress();
      }}>
      <HeaderIcon
        style={{
          color: Colors.black,
          fontSize: Dimensions.get('screen').width * 0.065,
        }}
        name={'arrow-back-ios'}
        type={'MaterialIcons'}
      />
      <Text style={{color: Colors.black, fontSize: 11}}>
        {' ' + page_header}
      </Text>
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

export default VaccineList;
