// packages
import {BackHandler} from 'react-native';
/**
 * Attaches an event listener that handles the android-only hardware
 * back button
 * @param  {Function} callback The function to call on click
 */
const handleAndroidBackButton = (callback) => {
  try {
    BackHandler.addEventListener('hardwareBackPress', () => {
      callback();
      return true;
    });
  } catch (err) {}
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = (callback) => {
  try {
    BackHandler.removeEventListener('hardwareBackPress', () => {
      if (callback) callback();
      return true;
    });
  } catch (err) {}
};
export {handleAndroidBackButton, removeAndroidBackButtonHandler};
