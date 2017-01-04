/**
* @Author: Zz
* @Date:   2016-09-14T19:25:42+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:33:17+08:00
*/

import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router';

import './style.less';
import '../style/iconfont.css';

export default class DefBreadcrumb extends React.Component {
  static PropTypes = {
    items : React.PropTypes.array,
  }

  constructor(props){
    super(props);
  }

  renderIcon(item){
    if(item.icon){
      if(item.customize)
        return <i className="iconfont" style={{marginLeft: '10px', marginRight: '5px'}}>{item.icon}</i>
      return <Icon type={item.icon} style={{marginRight: '5px'}}/>
    }
    return null;
  }

  renderLink(item){
    if(item.to || item.href){
      return <Link to={item.to || item.href}>
        {this.renderIcon(item)}
        {item.content}
      </Link>
    }
    return (<span>{this.renderIcon(item)} {item.content}</span>);
  }

  renderItem(){
    const items = this.props.items;

    if(!items || items.length === 0)
      return null;

    let i = 0;
    return items.map( item => {
      ++i;
      return (
        <Breadcrumb.Item key={`breadcrumb${i}`} style={{"fontSize": "14px"}}>
          {this.renderLink(item)}
        </Breadcrumb.Item>
      );
    })
  }

  render(){
    return(
      <div>
        <div className="hms-layout-breadcrumb">
          <Breadcrumb separator=">">
            {this.renderItem()}
          </Breadcrumb>
        </div>
        <div className="hms-breadcrumb-content-layout-header"></div>
      </div>
    );
  }
}
