import React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Landing from './screens/Landing';
import Login from './screens/Login';
import VaccineList from './screens/VaccineList';
import {MyRoot} from './components/MyRoot';
import {Provider} from 'react-redux';
import store from './redux/store';

const MainNavigator = createStackNavigator(
  {
    Login: {screen: Login},
    Landing: {screen: Landing},
    VaccineList: {screen: VaccineList},
  },
  {
    initialRouteName: 'Login',
  },
);

const App = createAppContainer(MainNavigator);

export default () => {
  return (
    <Provider store={store}>
      <MyRoot>
        <App />
      </MyRoot>
    </Provider>
  );
};
