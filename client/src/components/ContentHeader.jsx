import React from 'react';
import { Breadcrumb, Icon } from 'antd';
require('../style/iconfont.css');

export default class ContentHeader extends React.Component {
  static propTypes = {
    content : React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
    ]),
    color: React.PropTypes.string,
    icon: React.PropTypes.string,
    iconfont: React.PropTypes.string,
    customize: React.PropTypes.bool,
    type: React.PropTypes.string,
    fontSize: React.PropTypes.string,
  }

  constructor(props){
    super(props);
  }

  renderTitle() {
    if(this.props.customize){
      return <i className="iconfont" style={{marginRight: '10px'}}>{this.props.icon}</i>
    }else if(this.props.iconfont){
      return <i className="iconfont" style={{marginRight: '10px'}}>{this.props.iconfont}</i>
    }
    return (
      <Icon type={this.props.icon || (this.props.type && this.props.type === 'edit' ? "edit" : "appstore")} style={{marginRight: "10px"}}/>
    );
  }

  render(){
    let style={ fontSize: this.props.fontSize || "16px" };
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
