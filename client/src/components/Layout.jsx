/**
* @Author: Zz
* @Date:   2016-09-10T14:07:24+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-07T12:12:07+08:00
*/
import React from 'react';
import { Icon, } from 'antd';
import "./style.less";

import Footer from './Footer';
import Navigation from './Navigation';

export default class Layout extends React.Component {
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

  renderSideNav() {
    if(!this.state.collapse){
      return this.props.children;
    }
    return React.cloneElement(this.props.children, {collapse: true});
  }

  render() {
    const { collapse } = this.state;
    const logo = require('../images/logo.png');// 'http://dev.utuapp.cn/assets/metronic/admin/layout/img/logo.png';
    return (
      <div className={collapse ? "ant-layout-aside ant-layout-aside-collapse" : "ant-layout-aside"}>
        <aside className="ant-layout-sider">
          <div className="ant-layout-logo">
            {collapse ? <img style={{marginLeft: '-28px'}} src={logo}/> : <img src={logo}/>}
          </div>
          {this.renderSideNav()}
          <div className="ant-aside-action" onClick={this.onCollapseChange}>
            {collapse ? <Icon type="right" /> : <Icon type="left" />}
          </div>
        </aside>
        <div className="ant-layout-main">
          <div className="hms-layout-nav-header">
            <Navigation />
          </div>
          {this.props.children.props.children}
        </div>
        {/*<Footer/>*/}
      </div>
    );
  }
}
