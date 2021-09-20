import {BackHandler} from 'react-native';
import {AsyncStorages} from '../components/AsyncStorages';
import moment from 'moment';

const Commons = {
  /**
   *(manage back button)
   *@param  :navigation,exit
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  handleBackPress(navigation, exit) {
    try {
      let index = navigation.dangerouslyGetParent().state.index;
      if (exit) BackHandler.exitApp();
      else if (index > 1) navigation.goBack();
      else BackHandler.exitApp();
    } catch (err) {}
  },

  /**
   *(handle navigation)
   *@param  :navigation,page,params
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  navigateToPage(navigation, page, param) {
    if (!navigation) return;
    if (param) navigation.navigate(page, param);
    else navigation.navigate(page);
  },
  /**
   *(logout)
   *@param  :navigation
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  logoutAction(navigation) {
    try {
      AsyncStorages.clear();
      navigation.replace('Login');
    } catch (err) {}
  },
  /**
   *(get date)
   *@param  :null
   *@return :(dd-mm-yyyy)
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  getDate() {
    var dt = new Date();
    var formatteddate = moment(dt).format('DD-MM-YYYY');
    return formatteddate;
  },
};

export default Commons;
