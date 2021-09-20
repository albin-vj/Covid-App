/***
 Use this component inside your React Native Application.
 A scrollable list with different item type
 */
import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import Colors from '../config/Colors';
import {NBIcon as Icon} from './nativeBase';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

const recycleref = React.createRef();

/***
 * To test out just copy this component and render in you root component
 */
export default class RecycleTestComponent extends React.Component {
  constructor(args) {
    super(args);

    let {width} = Dimensions.get('window');

    //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    //Create the layout provider
    //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
    //Second: Given a type and object set the height and width for that type on given object
    //If you need data based check you can access your data provider here
    //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
    //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file
    this._layoutProvider = new LayoutProvider(
      (index) => {
        return ViewTypes.FULL;
      },
      (type, dim) => {
        dim.width = this.props.numberColumns
          ? width / this.props.numberColumns
          : width;
        dim.height = this.props.height;
      },
    );
    this._rowRenderer = this._rowRenderer.bind(this);
    this._footerRender = this._footerRender.bind(this);

    //Since component should always render once data has changed, make data provider part of the state
    this.state = {
      dataProvider: dataProvider.cloneWithRows(this.props.data),
      loading: false,
      showtop: false,
      endreach: false,
      statechange: {
        ids: this.props.statechange ? [this.props.statechange] : [],
      }, //this.props.statechange?this.props.statechange:""
    };
  }

  componentDidUpdate(previousProps, previousState) {
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    if (
      previousProps.data !== this.props.data ||
      (this.props.statechangeer &&
        previousProps.statechangeer &&
        previousProps.statechangeer !== this.props.statechangeer) ||
      (this.props.statechange &&
        previousProps.statechange &&
        previousProps.statechange !== this.props.statechange)
    ) {
      if (
        (this.props.statechangeer &&
          previousProps.statechangeer &&
          previousProps.statechangeer !== this.props.statechangeer) ||
        (this.props.statechange &&
          previousProps.statechange &&
          previousProps.statechange !== this.props.statechange)
      )
        this.setState({
          statechange: {
            ids: this.props.statechange ? [this.props.statechange] : [],
          },
        });
      else
        this.setState({
          dataProvider: dataProvider.cloneWithRows(this.props.data),
        });
    }
  }

  _generateArray(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  }

  //Given type and data return the view component
  _rowRenderer(type, data, index) {
    return this.props.renderView({data, index});
    //You can return any view here, CellContainer has no special significance
  }
  _footerRender() {
    if (this.props.renderFooter) return this.props.renderFooter({});
    else return this._renderDefaultEmptyView();
    //You can return any view here, CellContainer has no special significance
  }

  _renderDefaultEmptyView() {
    return <View></View>;
  }

  render() {
    return (
      <>
        <RecyclerListView
          style={{
            marginBottom:
              this.props.bottommargin && this.state.endreach
                ? this.props.bottommargin
                : 0,
          }}
          // initialOffset={1000}
          // renderAheadOffset={1000}
          disableRecycling
          // extendedState={this.state.statechange}
          ref={recycleref}
          onScroll={(r, x, y) => {
            if (Number(y) > 300) {
              this.setState({showtop: true});
            } else this.setState({showtop: false});

            if (Number(y) > 1000) {
              this.setState({endreach: true});
            } else this.setState({endreach: false});
          }}
          scrollViewProps={{
            showsVerticalScrollIndicator: false,
            refreshControl: (
              <RefreshControl
                colors={[Colors.black, Colors.black]}
                refreshing={this.state.loading}
                onRefresh={async () => {
                  this.setState({loading: true});
                  await this.props.onRefresh();
                  this.setState({loading: false});
                }}
              />
            ),
          }}
          canChangeSize={true}
          layoutProvider={this._layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this._rowRenderer}
          renderFooter={this._footerRender}></RecyclerListView>
        {this.state.showtop && !this.props.hideUpArrow ? (
          <TouchableOpacity
            onPress={() => {
              recycleref.current?.scrollToOffset(0, 0, true);
            }}
            style={{
              position: 'absolute',
              bottom: '10%',
              left: '45%',
              right: '45%',
              height: Dimensions.get('screen').width * 0.15,
              width: Dimensions.get('screen').width * 0.15,
            }}>
            <Icon
              style={{
                color: Colors.lightGrey,
                fontSize: Dimensions.get('screen').width * 0.12,
              }}
              type={'MaterialCommunityIcons'}
              name={'arrow-up-circle'}
            />
          </TouchableOpacity>
        ) : null}
      </>
    );
  }
}
const styles = {
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#00a1f1',
  },
  containerGridLeft: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#ffbb00',
  },
  containerGridRight: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#7cbb00',
  },
};
