import types from '../types';
import {initialState} from '../InitialState';

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_PROGRESS:
      return {
        ...state,
        progress: true,
      };
    case types.HIDE_PROGRESS:
      return {
        ...state,
        progress: false,
      };
    case types.TOGGLE_PROGRESS:
      return {
        ...state,
        progress: !state.progress,
      };
    case types.SET_USERDATA:
      return {
        ...state,
        userData: action.payload,
      };
    case types.SET_STATES:
      return {
        ...state,
        states: action.payload,
      };
    case types.SET_DISTRICTS:
      return {
        ...state,
        districts: action.payload,
      };
    case types.SELECT_STATE:
      return {
        ...state,
        selectedState: action.payload,
      };
    case types.SELECT_DISTRICT:
      return {
        ...state,
        selectedDistrict: action.payload,
      };

    case types.SELECT_PINCODE:
      return {
        ...state,
        selectedPincode: action.payload,
      };
    case types.TOGGLE_LABEL:
      return {
        ...state,
        showLabel: !state.showLabel,
      };
    case types.TOGGLE_LNDNG_PAGE_TAB:
      return {
        ...state,
        landingPageTab: action.payload,
      };
    case types.TOGGLE_VACCINE_PAGE_TAB:
      return {
        ...state,
        vaccinePageTab: action.payload,
      };
    case types.TOGGLE_LOGOUT_POPUP:
      return {
        ...state,
        logoutButton: !state.logoutButton,
      };
    case types.SET_VACCINE:
      return {
        ...state,
        vaccine: action.payload,
      };
    case types.SET_VACCINE_COPY:
      return {
        ...state,
        vaccineCopy: action.payload,
      };
    case types.SET_VACCINE_FILTERS:
      return {
        ...state,
        vaccineFilters: action.payload,
      };
    default:
      return state;
  }
};

export default Reducer;
