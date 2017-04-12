/*
 * @Author: Zz
 * @Date: 2017-04-10 21:17:12
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 00:10:41
 */
import React from 'react';
import { Icon } from 'antd';

require('../style/iconfont.css');

export default class ZIcon extends React.Component {
    static propTypes = {
      icon: React.PropTypes.string,
      iconfont: React.PropTypes.string,
      size: React.PropTypes.string,
    }

    constructor(props) {
      super(props);
    }

    render () {
      if(this.props.icon)
        return <Icon type={this.props.icon} style={this.props.style || {fontSize: this.props.size || '16px'}} />
      return (<i className="iconfont" style={{marginLeft: this.props.marginLeft, marginRight: this.props.marginRight || '5px', fontSize: this.props.size || '16px'}}>{ this.props.iconfont} </i>);
    }
}
