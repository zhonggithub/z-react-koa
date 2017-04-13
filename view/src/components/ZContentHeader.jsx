/*
 * @Author: Zz
 * @Date: 2017-04-10 21:16:40
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 22:01:31
 */
import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import ZIcon from './ZIcon';

export default class ZContentHeader extends React.Component {
  static propTypes = {
    content : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ]),
    color: PropTypes.string,
    icon: PropTypes.string,
    iconfont: PropTypes.string,
    customize: PropTypes.bool,
    type: PropTypes.string,
    fontSize: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  renderTitle() {
    if (this.props.customize){
      return <i className="iconfont" style={{marginRight: '10px'}}>{this.props.icon}</i>
    } else if (this.props.iconfont) {
      return <i className="iconfont" style={{marginRight: '10px'}}>{this.props.iconfont}</i>
    }
    return (
      <Icon type={this.props.icon || (this.props.type && this.props.type === 'edit' ? "edit" : "appstore")} style={{marginRight: "10px"}}/>
    );
  }

  render(){
    let style = { fontSize: this.props.fontSize || "16px" };
    if(this.props.color)
      style.color = this.props.color;
    else if(this.props.type && this.props.type === 'edit')
      style.color = '#e26a6a';
    return(
      <div style={style}>
        <div className="hms-content-header">
          {this.renderTitle()}{this.props.content}
        </div>
        <div className="ant-content-layout-header"></div>
      </div>
    );
  }
}
