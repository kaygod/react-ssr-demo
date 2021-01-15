import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

/**
 * 导出服务器端的store
 */
export const getServerStore = () => {
  return createStore(reducers, applyMiddleware(thunk));
};

/**
 * 导出客户端的store
 */
export const getClientStore = () => {
  const defaultState = window.context.state;
  return createStore(reducers, defaultState, applyMiddleware(thunk));
};
