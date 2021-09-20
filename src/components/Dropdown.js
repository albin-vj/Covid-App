import React, {Component, Fragment} from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Colors from '../config/Colors';

export const Dropdown = (props) => {
  return (
    <Fragment>
      {/* Single */}
      <SearchableDropdown {...props} />
    </Fragment>
  );
};

Dropdown.defaultProps = {
  itemStyle: {
    padding: 10,
    marginTop: 2,
    backgroundColor: Colors.lightGrey,
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    borderRadius: 5,
  },
  itemTextStyle: {color: Colors.black},
  itemsContainerStyle: {maxHeight: 160},
  containerStyle: {padding: 0},
  resetValue: false,
  listProps: {
    nestedScrollEnabled: true,
  },
};
