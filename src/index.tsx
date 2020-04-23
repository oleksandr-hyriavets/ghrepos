import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './redux/rootReducer';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { LocalStorageService, LocalStorage } from './services/LocalStorageService';
import rootSaga from './redux/sagas';
import { setAuthenticated } from './redux/actions/auth';
import { setAuthorizationHeader } from './services/AuthService';
import { App } from './App';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(sagaMiddleware)
));

sagaMiddleware.run(rootSaga);

const localStorageService = new LocalStorageService(window.localStorage as LocalStorage);
const accessToken = localStorageService.get<string | null>('accessToken');

if (accessToken) {
  store.dispatch(setAuthenticated(true));
  setAuthorizationHeader(accessToken);
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
