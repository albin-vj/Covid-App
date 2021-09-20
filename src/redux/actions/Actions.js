import types from '../types';
/**
 *(show hide progress)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const showHideProgress = (payload = false) => {
  return {
    type: types.TOGGLE_PROGRESS,
    payload: payload,
  };
};
/**
 *(show progress)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const showProgress = (payload = false) => {
  return {
    type: types.SHOW_PROGRESS,
    payload: payload,
  };
};
/**
 *(hide progress)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const hideProgress = (payload = false) => {
  return {
    type: types.HIDE_PROGRESS,
    payload: payload,
  };
};
/**
 *(set states)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const SetStates = (payload = []) => {
  return {
    type: types.SET_STATES,
    payload: payload,
  };
};
/**
 *(set districts)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const SetDistricts = (payload = []) => {
  return {
    type: types.SET_DISTRICTS,
    payload: payload,
  };
};
/**
 *(set vaccine data)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const SetVaccine = (payload = []) => {
  return {
    type: types.SET_VACCINE,
    payload: payload,
  };
};
/**
 *(set  vaccine data copy)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const SetVaccineCopy = (payload = []) => {
  return {
    type: types.SET_VACCINE_COPY,
    payload: payload,
  };
};
/**
 *(set userdata after login)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */

const setUserData = (payload = {}) => {
  return {
    type: types.SET_USERDATA,
    payload: payload,
  };
};
/**
 *(set selected state)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const selectState = (payload = {}) => {
  return {
    type: types.SELECT_STATE,
    payload: payload,
  };
};
/**
 *(set selected district)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const selectDistrict = (payload = {}) => {
  return {
    type: types.SELECT_DISTRICT,
    payload: payload,
  };
};
/**
 *(set selected pincode)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const selectPincode = (payload = '') => {
  return {
    type: types.SELECT_PINCODE,
    payload: payload,
  };
};
/**
 *(toggle textinput label)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const toggleLabel = (payload = false) => {
  return {
    type: types.TOGGLE_LABEL,
    payload: payload,
  };
};
/**
 *(toggle landing page tab)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const toggleLandingTab = (payload = 0) => {
  return {
    type: types.TOGGLE_LNDNG_PAGE_TAB,
    payload: payload,
  };
};
/**
 *(toggle vaccine page tab)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const toggleVaccineTab = (payload = 0) => {
  return {
    type: types.TOGGLE_VACCINE_PAGE_TAB,
    payload: payload,
  };
};

/**
 *(toggle logout popup)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */

const toggleLogoutPopup = (payload = false) => {
  return {
    type: types.TOGGLE_LOGOUT_POPUP,
    payload: payload,
  };
};
/**
 *(set vaccine filters)
 *@created by    :albin
 *@modified by   :albin
 *@modified date :18/09/21
 */
const SetVaccineFilters = (payload = {}) => {
  return {
    type: types.SET_VACCINE_FILTERS,
    payload: payload,
  };
};

const Actions = {
  showHideProgress,
  showProgress,
  hideProgress,
  SetStates,
  SetDistricts,
  SetVaccine,
  SetVaccineCopy,
  setUserData,
  selectState,
  selectDistrict,
  selectPincode,
  toggleLabel,
  toggleLandingTab,
  toggleVaccineTab,
  toggleLogoutPopup,
  SetVaccineFilters,
};
export default Actions;
