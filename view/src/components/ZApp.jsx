/*
 * @Author: Zz
 * @Date: 2017-04-11 20:38:24
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-11 23:45:00
 */
import React from 'react';
import { Route } from 'react-router-dom';
import { Icon, } from 'antd';
import "./style.less";

import ZFooter from './ZFooter';
import ZNavigation from './ZNavigation';

export default class ZApp extends React.Component {
  static propTypes = {
    routes: React.PropTypes.array.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  onCollapseChange = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  renderSideNav = () => {
    return this.props.routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.sidebar}
            // component={ !this.state.collapse ? route.sidebar : React.cloneElement(route.sidebar, {collapse: true})
            //}
          />
        ));
  }

  renderMain = () => {
    return this.props.routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.main}
          />
        ));
  }

  render() {
    const { collapse } = this.state;
    const logo = require('../images/logo.png');
    return (
      <div className={collapse ? "ant-layout-aside ant-layout-aside-collapse" : "ant-layout-aside"}>
        <aside className="ant-layout-sider">
          <div className="ant-layout-logo">
            {collapse ? <img style={{marginLeft: '-28px'}} src={logo}/> : <img src={logo}/>}
          </div>
          { this.renderSideNav() } 
          <div className="ant-aside-action" onClick={this.onCollapseChange}>
            <Icon type={ collapse ? 'right' : 'left'} />
          </div>
        </aside>
        <div className="ant-layout-main">
          <div className="hms-layout-nav-header">
            <ZNavigation />
          </div>
          { this.renderMain() }
        </div>
        {/*<Footer/>*/}
      </div>
    );
  }
}