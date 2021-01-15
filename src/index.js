import Koa2 from 'koa';
import staticFiles from 'koa-static';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Switch, Route, StaticRouter } from 'react-router-dom';
import Routes from './route';
import { Provider } from 'react-redux';
import { getServerStore } from './store';
import { matchRoutes } from 'react-router-config';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import Helmet from 'react-helmet';

const app = new Koa2();

/**
 * 静态资源直接返回
 */
app.use(staticFiles('public'));

/**
 * 应用接管路由
 */
app.use(async function (ctx) {
  const req = ctx.request;

  //图标直接返回
  if (req.path === '/favicon.ico') {
    ctx.body = '';
    return false;
  }

  //获取store仓库
  const store = getServerStore();

  //将路由配置项和请求路径进行比对
  const matchs = matchRoutes(Routes, req.path) || [];

  const all = [];

  //为什么这里会返回数组呢,因为当前的请求可能访问一个嵌套路由
  matchs.forEach((item) => {
    if (item.route && item.route.loadData) {
      const pro = new Promise((resolve) => {
        item.route.loadData(store).then(resolve).catch(resolve); //每个路由都会定义一个获取数据的方法,将store仓库传入其中获取数据
      });
      all.push(pro);
    }
  });

  await Promise.all(all); //为了确保loadData里面的异步操作都完成了

  const routesArray = (
    <Switch>
      {Routes.map((item) => (
        <Route {...item} />
      ))}
    </Switch>
  );

  /**
   * 将css样式注入
   */
  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));

  /**
   * 这里是实现服务器端渲染的关键
   * routesArray是路由数组组成的集合,怎么确定当前路径渲染哪一个路由呢?StaticRouter解决这一问题
   * 外面再用Provider包裹,这样ele首先可以找到渲染的路由组件,此时store已经是注满数据的仓库,在该组件内部就可以从store中获取数据渲染
   */
  const ele = (
    <Provider store={store}>
      <StyleContext.Provider value={{ insertCss }}>
        <StaticRouter location={req.path} context={{}}>
          {routesArray}
        </StaticRouter>
      </StyleContext.Provider>
    </Provider>
  );

  //将react组件转化成字符串返回给前端
  const htmlString = renderToString(ele);

  const { title, meta } = Helmet.renderStatic(); //设置title和meta

  ctx.body = `<html>
			<head>
        ${title}
        ${meta}
        <style>${[...css].join('')}</style>
			</head>
			<body>
        <div id="root">${htmlString}</div>
        <script>
           var context = {
              state: ${JSON.stringify(store.getState())}
           }
        </script>
        <script src="./index.js"></script>
			</body>
  	</html>`;
});

var server = app.listen(3000);
