import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Routes from '../route';
import { getClientStore } from '../store';
import { Provider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';

const insertCss = (...styles) => {
  const removeCss = styles.map((style) => style._insertCss());
  return () => removeCss.forEach((dispose) => dispose());
};

/**
 * 为什么这里要用 hydrate 而不是 render
 *
 * 如果是客户端渲染,react将编译后的dom整体往root中一塞
 *
 * 如果是hydrate,那么客户端就知道这是服务器渲染的dom,那么react此时就只会给已存在在页面上的dom添加事件而不会替换
 *
 */
ReactDOM.hydrate(
  <Provider store={getClientStore()}>
    <StyleContext.Provider value={{ insertCss }}>
      <BrowserRouter>
        <Switch>
          {Routes.map((item) => {
            return <Route {...item} />;
          })}
        </Switch>
      </BrowserRouter>
    </StyleContext.Provider>
  </Provider>,
  document.getElementById('root')
);
