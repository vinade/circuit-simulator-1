/* @flow */

'use strict';

import React from 'react';
import FullScreen from 'react-fullscreen';
import Theme from 'circuitsim-theme';
import CircuitDiagram from '../src/CircuitDiagram.js';

const rootInstance = React.render(
  <FullScreen>
    <CircuitDiagram theme={ theme } />
  </FullScreen>,
  document.getElementById('circuitsim')
);

if (module.hot) {
  require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
    getRootInstances: function () {
      // Help React Hot Loader figure out the root component instances on the page:
      return [rootInstance];
    }
  });
}
