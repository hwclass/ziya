import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import App from './components/App';
import './index.css';

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    const AppRoot = require('./components/App').default;

    ReactDOM.render(
      <AppContainer>
        <AppRoot />
      </AppContainer>,
      document.getElementById('root'),
    );
  });
}
