import AsyncStorage from '@react-native-async-storage/async-storage';
export const AsyncStorages = {
  /**
   *to set item
   *@param  :property name and property value
   *@return :nil
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :18/09/21
   */
  async setItem(name, value) {
    try {
      var k = await AsyncStorage.getItem('DATA');
      var j = {};
      if (k != null) {
        j = JSON.parse(k);
      }
      j[name] = value;
      await AsyncStorage.setItem('DATA', JSON.stringify(j));
      return;
    } catch (err) {}
  },
  /**
   *to get item
   *@param  : property name or nothing
   *@return : if( nothing ) return else value of the property
   *@created by    :Albin
   *@modified by   :Albin
   *@modified date :18/09/21
   */
  async getItem(name) {
    try {
      if (name == null) {
        var k = await AsyncStorage.getItem('DATA');
        var j = JSON.parse(k);
        return j;
      }
      var k = await AsyncStorage.getItem('DATA');
      var j = JSON.parse(k);
      if (
        (j != null || j != undefined) &&
        (j[name] != null || j[name] != undefined)
      ) {
        return j[name];
      } else {
        return undefined;
      }
    } catch (err) {}
  },
  /**
   *(to clear async storage)
   *@param  :null
   *@return :null
   *@created by    :albin
   *@modified by   :albin
   *@modified date :18/09/21
   */
  async clear() {
    try {
      await AsyncStorage.clear();
    } catch (error) {}
  },
};
