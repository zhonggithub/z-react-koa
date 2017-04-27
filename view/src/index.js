/**
* @Author: Zz
* @Date:   2016-09-10T10:35:08+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-12T21:40:21+08:00
*/
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route, Redirect, Switch, } from 'react-router-dom';
import { PageLogin, PageLoginIndex } from './login';
import { ZLayout, ZNavigation, ZApp, ZBreadcrumb } from './components';
import { TestSider, TestSider1, TestList, } from './test'
import stores from './stores';
import 'antd/dist/antd.less';
import './style/iconfont.css';

let mountNode = document.getElementById('appContent');

function auth(nextState, replace) {
  return stores.appStore.isLogin;
}

const routes = [
  { path: '/index',
    exact: true,
    sidebar: () => <TestSider/>,
    main: () => { return (<div>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      <h2>Home</h2>
      </div>)}
  },
  { path: '/bubblegum',
    sidebar: () => <TestSider1/>,
    main: () => <TestList/>
  },
  { path: '/shoelaces',
    sidebar: () => <div>Shoelaces</div>,
    main: () => <h2>Shoelaces</h2>
  },
  
];

ReactDOM.render((
  <Provider stores={stores}>
    <BrowserRouter>
      <div>
        <Route path="/" render={ () => {
          return auth() ? <ZApp routes={routes}/> : <PageLogin/>
        }}>
        </Route>
     </div>
    </BrowserRouter>
  </Provider>
), mountNode);
