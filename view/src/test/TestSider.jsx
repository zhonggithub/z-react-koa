/*
 * @Author: Zz
 * @Date: 2017-02-28 10:34:19
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-15 17:59:01
 */
import React from 'react';
import { ZSideNavigation, ZIcon } from '../components';

const g_prefix = '/zplatorm/sidenav/';
const g_defIconLargenSize = 24; 
const g_pageMenuDef = [
   {
     to: `${g_prefix}accountservice`,
     text: '账号服务',
     // icon: <ZIcon iconfont='&#xe629;' />,
     // inlineIcon: <ZIcon iconfont='&#xe629;' size={g_defIconLargenSize} marginRight='0px' />,
     icon: 'team',
     items: [
    //    {
    //    to: '/group/dockingplatform/weixin/overview',
    //    text: '概况',
    //    defIcon: <DefIcon iconfont='&#xe61f;' /> ,
    //  },
     {
       to: `${g_prefix}accountservice/account`,
       text: '账号管理',
       icon: 'user'
     },
     ]
   },
 ];

export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: [g_pageMenuDef[0].items[0].to],
      defaultOpenKeys : [g_pageMenuDef[0].to],//g_pageMenuDef.map( item => {return item.to;}),
    };
  }

  componentWillMount(){
    const localHref = window.location.href;
    if(!localHref)
      return;
    for(let item of g_pageMenuDef) {
      for( let subItem of item.items) {
        if(localHref.indexOf(subItem.to) !== -1) {
          this.setState({ current: [subItem.to] });
          return;
        }
      }
    }
  }

  componentDidMount() {
  }

  onSelect = (info) => {
    this.setState({ current: [info.key] })
  }

  render() {
    return <ZSideNavigation
      menus={g_pageMenuDef}
      collapse={this.props.collapse}
      defaultOpenKeys={this.state.defaultOpenKeys}
      defaultSelectedKeys={this.state.current}
      selectedKeys={this.state.current}
      onSelect={ this.onSelect }
      />
  }
}
