/*
 * @Author: Zz
 * @Date: 2017-04-10 21:17:12
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 21:18:34
 */
import React from 'react';
import PropTypes from 'prop-types';
import { computed } from 'mobx';
import { Icon } from 'antd';

require('../style/iconfont.css');

export default class ZIcon extends React.Component {
  static propTypes = {
    icon: PropTypes.string,
    iconfont: PropTypes.string,
    size: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  }

  @computed get style() {
    if (this.props.icon) {
      return Object.assign({ fontSize: `${this.props.size || 16}px` }, this.props.style || {});
    }
    return Object.assign({ fontSize: `${this.props.size || 16}px`, marginRight: '8px', display: 'inline-block' }, this.props.style || {});
  }

  constructor(props) {
    super(props);
  }

  render () {
    const tmpProps = Object.assign({}, this.props);
    for (const item in this.props) {
      switch(item) {
        case 'icon': case 'iconfont': case 'size': {
          delete tmpProps[item];
          break;
        }
      }
    }
    
    if(this.props.icon)
      return <Icon { ...tmpProps } type={this.props.icon} style={this.style} />
    return (<i className="iconfont" { ...tmpProps } style={this.style}>{ this.props.iconfont}</i>);
  }
}
