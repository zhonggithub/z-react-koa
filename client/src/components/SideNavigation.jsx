/**
* @Author: Zz
* @Date:   2016-10-08T21:43:45+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T23:26:08+08:00
*/
import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Menu, Icon } from 'antd';
import DefIcon from '../components/DefIcon';

import './style.less';

const SubMenu = Menu.SubMenu;

export default class SideNavigation extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          collapse: false,
      }
    }

    handleClick = (e) => {
    this.setState({
      current: e.key,
    });
    browserHistory.replace(e.key);
  }

  rendIcon(item) {
    if(!item)
      return;
    if(item.defIcon || item.defIconSmall || item.defIconLargen){
      if((item.defIconSmall || item.defIcon) && !this.props.collapse){
        return (item.defIconSmall || item.defIcon);
      }
      if(item.defIconLargen && this.props.collapse){
        return item.defIconLargen;
      }
      else{
        return (item.defIconSmall || item.defIcon);
      }
    }

    if(item.icon)
      return ( <DefIcon icon={item.icon} size={this.props.collapse ? '24px' : '16px'}/> );
    else if(item.iconfont)
      return ( <DefIcon iconfont={item.iconfont} size={this.props.collapse ? '24px' : '16px'} /> );
    else {
      return null;
    }
  }

  renderMenuItem(items) {
    if(!items)
      return null;
    const spanFontSize = {"fontSize": "14px"};
    return items.map( item => {
      if (item.items) {
        return this.renderSubMenu([item], false);
      }
      const iconTitle = this.rendIcon(item);
      return <Menu.Item key={ item.to } className="ant-menu-item">
              <Link to={ item.to }>
                <span className="hms-span-text" > { iconTitle } { item.text } </span>
              </Link>
            </Menu.Item>
    })
  }

  renderSubMenu(menus, isFirstLevelMenus=true) {
    if(!menus)
      return null;
    const spanFontSize = {"fontSize": "14px"};
    return menus.map( item => {
      const iconTitle = this.rendIcon(item);
      if(!item.items)
        return (<Menu.Item key={ item.key || item.to} className="ant-menu-submenu-title">
          <span className='hms-span-text'>{iconTitle}{this.props.collapse && isFirstLevelMenus ? '' : <span>{ item.text }</span>}</span>
        </Menu.Item>);
      return <SubMenu
              key={ item.key || item.to }
              title={<span className={this.props.collapse ? (isFirstLevelMenus ? 'hms-collapse-menu-submenu-title' : 'hms-collapse-menu-second-submenu-title'): 'hms-span-text'}>{iconTitle}{this.props.collapse && isFirstLevelMenus ? '' : <span>{ item.text}</span>}</span>}>
              { this.renderMenuItem(item.items) }
        </SubMenu>
    });
  }

  onCollapseChange = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {
    return(
      <Menu mode={this.props.collapse ? "vertical" : "inline"}
        defaultSelectedKeys={ this.props.defaultSelectedKeys }
        defaultOpenKeys={ this.props.defaultOpenKeys }
        selectedKeys={ this.props.selectedKeys }
        onSelect={ this.props.onSelect }
        onClick={ this.props.onClick }
        //style={{background: '#293542'}}
      >
        {this.renderSubMenu(this.props.menus)}
      </Menu>
    );
  }
}
