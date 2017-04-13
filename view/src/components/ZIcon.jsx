/*
 * @Author: Zz
 * @Date: 2017-04-10 21:17:12
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 09:25:35
 */
import React from 'react';
import { computed } from 'mobx';
import { Icon } from 'antd';

require('../style/iconfont.css');

export default class ZIcon extends React.Component {
    static propTypes = {
      icon: React.PropTypes.string,
      iconfont: React.PropTypes.string,
      size: React.PropTypes.string,
    }

    @computed get style() {
      if (this.props.icon) {
        return Object.assign({ fontSize: this.props.size || '16px' }, this.props.style || {});
      }
      return Object.assign({ fontSize: this.props.size || '16px', marginRight: '8px', display: 'inline-block' }, this.props.style || {});
    }

    constructor(props) {
      super(props);
    }

    render () {
      if(this.props.icon)
        return <Icon type={this.props.icon} style={this.style} />
      return (<i className="iconfont" style={this.style}>{ this.props.iconfont}</i>);
    }
}
