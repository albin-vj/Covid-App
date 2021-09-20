import React from 'react';

const NetworkCall = {
  async post(url) {
    return fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        return error;
      });
  },
};

export default NetworkCall;
