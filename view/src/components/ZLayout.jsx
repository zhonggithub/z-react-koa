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

import ZFooter from './ZFooter';
import ZNavigation from './ZNavigation';

export default class ZLayout extends React.Component {
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
    if(!this.state.collapse || !this.props.children){
      return this.props.children;
    }
    return React.cloneElement(this.props.children, {collapse: true});
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
          {this.renderSideNav()}
          <div className="ant-aside-action" onClick={this.onCollapseChange}>
            <Icon type={ collapse ? 'right' : 'left'} />
          </div>
        </aside>
        <div className="ant-layout-main">
          <div className="hms-layout-nav-header">
            <ZNavigation />
          </div>
          { this.props.children ? this.props.children.props.children : null }
        </div>
        {/*<Footer/>*/}
      </div>
    );
  }
}
