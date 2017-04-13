/*
 * @Author: Zz
 * @Date: 2017-04-10 21:16:40
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 22:30:01
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
    type: PropTypes.oneOf(['edit', 'list']),
    fontSize: PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  @computed get style() {
    const style = { fontSize: this.props.fontSize || "16px" };
    if (this.props.color)
      style.color = this.props.color;
    else if (this.props.type && this.props.type === 'edit')
      style.color = '#e26a6a';
    return style;
  }

  @computed get titleStyle() {
    const tmpStyle = { marginRight: '10px' };
    if (this.props.iconfont) {
      return <i className="iconfont" style={ tmpStyle }>{this.props.iconfont}</i>
    }
    return tmpStyle;
  }
  @computed get icon() {
    let tmpType = 'appstore';
    switch(this.props.type) {
      case 'edit': {
        tmpType = 'edit';
        break;
      }
      case 'list': {
        tmpType = 'appstore';
        break;
      }
    }
    return tmpType;
  }

  renderTitle() {
    return (
      <Icon type={ this.props.icon || this.icon } style={ this.titleStyle }/>
    );
  }

  render(){
    return(
      <div style={ this.style }>
        <div className="hms-content-header">
          {this.renderTitle()}{this.props.content}
        </div>
        <div className="ant-content-layout-header"></div>
      </div>
    );
  }
}
