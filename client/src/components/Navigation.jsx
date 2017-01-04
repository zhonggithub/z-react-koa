/**
* @Author: Zz
* @Date:   2016-09-10T23:53:18+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T23:14:24+08:00
*/
import { Link } from 'react-router';
import React from 'react';
import { Menu, Icon, Dropdown, Badge, Popover, Row, Button, Modal, notification, } from 'antd';
import { appStore, orderStore, } from '../common';

import './style.less';

notification.config({
  top: document.body.clientHeight - 100,
  //duration: 3,
});
const confirm = Modal.confirm;
const SubMenu = Menu.SubMenu;
const array = ["平台对接", "集团管理", "营销推广", "客户管理"];

const g_key = [
  '/group/dockingplatform', //平台对接
  '/group/groupmgr', // 集团管理
  '/group/marketingpromotion', //营销推广
  '/group/customermgr', //客户管理
]

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: [g_key[0]],
      currentLoginTool: [],
      user: {
      },
      orders: [],
      orderTotal: 0,
      isNotification: true,
    }
  }

  onNotificationClose =() => {
    this.setState({ isNotification: !this.state.isNotification});
  }

  openNotification = () => {
    const _this = this;
    notification.open({
      message: '您有新的订单',
      description: <a href='/group/groupmgr/order/notification'>请点击查看</a>,
      icon: <Icon type="smile-circle" style={{ color: '#108ee9' }} />,
      onClose: _this.onNotificationClose,
    });
  }

  componentWillMount() {
    const localHref = window.location.href;
    let { current, currentLoginTool } = this.state;
    for( let i = 0; i < g_key.length; ++i) {
      if(localHref.indexOf(g_key[i]) !== -1) {
        if(i >= 4) {
          this.state.currentLoginTool = [g_key[i]];
          this.state.current = [];
          // this.setState({ current: [], currentLoginTool: [g_key[i]] });
        }else{
          // this.setState({ current: [g_key[i]], currentLoginTool: [] });
          this.state.currentLoginTool = [];
          this.state.current = [g_key[i]];
        }
      }
    }
  }

  componentDidMount() {
    if(!appStore.payload.t) {
      return;
    }

    const _this = this;
    orderStore.notificationList({
      status: 0,
      page: 1,
      pageSize: 10,
    }).then(resData => {
      _this.setState({
        orders: resData.data.items,
        orderTotal: resData.data.total,
      });
      //_this.openNotification();
    }).catch(err => {
      _this.setState({
        error: err.message,
      });
    });
    setInterval(() => {
      orderStore.notificationList({
        status: 0,
        page: 1,
        pageSize: 10,
      }).then(resData => {
        _this.setState({
          orders: resData.data.items,
          orderTotal: resData.data.total,
        });
        // if(this.state.isNotification)
        //   _this.openNotification();
      }).catch(err => {
        _this.setState({
          error: err.message,
        });
      });
    }, 5000);
  }

  handleClick = (e) => {
    for( let i = 0; i < g_key.length; ++i) {
      if(e.key !== g_key[i])
        continue;

      if(i >= 4) {
        this.setState({ current: [], currentLoginTool: [e.key] });
      }else{
        this.setState({ current: [e.key], currentLoginTool: [] });
      }
      return;
    }
  }

  renderPopoverContent() {
    if(this.state.orders.length === 0) {
      return null;
    }
    let contentSpan = [];
    for(let i = 0; i < this.state.orders.length; ++i) {
      contentSpan.push(<Row style={{fontSize: '14px'}} key={`${i}:/group/groupmgr/order/info?id=${this.state.orders[i].id}`}>
          <Link to={`/group/groupmgr/order/info?id=${this.state.orders[i].orderId}`} ><Icon type="message"/> 新订单通知</Link>
        </Row>)
      if(i >= 4)
        break;
    }
    return <div>{contentSpan}</div>;
  }

  renderOrderNotification() {
    const orderNotify = <Link to='/group/groupmgr/order/notification'><Icon type="notification" style={{fontSize: '20px'}} /></Link>;
    if(this.state.orders.length === 0) {
      return orderNotify;
    }
    else {
      return <Popover content={this.renderPopoverContent()}>
               <Badge count={this.state.orderTotal}>
                  {orderNotify}
               </Badge>
              </Popover>
    }
  }

  showConfirm = () => {
    const _this = this;
    confirm({
      title: '是否退出?',
      //content: 'some descriptions',
      onOk() {
        appStore.logout()
          .then(resData => {
            appStore.token = null;//resData.token;
            location.href = '/group/login';
          }).catch(err => {
            _this.setState({message: err.message});
          });
      },
      onCancel() {},
    });
  }

  render() {
    const roles = appStore.payload.r;
    const role = roles && roles.length > 0 ? roles[0] : '';
    const roleStr = role ? ` | ${role}` : ''
    const loginToolTitle = `${appStore.payload.u}${roleStr}`;
    return (
      <div className="hms-layout-top">
        <div className="login-tool" >
          <Menu mode="horizontal"
            selectedKeys={this.state.currentLoginTool}
            onClick={this.handleClick}
            style={{lineHeight: '52px', background: '#293542', color: '#ffffff'}}
            theme='dark'
          >
            <Menu.Item key="5" className="ant-layout-menu-item-1">
              <Link to='/group'>联系客服</Link>
            </Menu.Item>
            <Menu.Item key="6" className="ant-layout-menu-item-1">
              <Link to='/dockingplatform'>帮助中心</Link>
            </Menu.Item>
            <Menu.Item key="7" className="ant-layout-menu-item-1">
              <Link to='/dockingplatform'>提交工单</Link>
            </Menu.Item>

            <Menu.Item key="8" className="ant-layout-menu-item-2">
              {this.renderOrderNotification()}
            </Menu.Item>

            <SubMenu className="ant-layout-menu-item-1" title={<span style={{'color': '#57c5f7'}} ><Icon type="user" style={{fontSize: '20px'}} />{ loginToolTitle } <Icon type="down" /></span>}>
              <Menu.Item>
                <a href='javascript:;' onClick={this.showConfirm}><Icon type="logout" />退出</a>
                {/*<Link to='/group/login' onClick={this.logout}><Icon type="logout" />退出</Link>*/}
              </Menu.Item>
              <Menu.Item>
                <Link to='/group/info/coupon'><Icon type="setting"  />账号设置</Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>

        <Menu
          mode="horizontal"
          onClick={this.handleClick}
          defaultSelectedKeys={this.state.current}
          selectedKeys={this.state.current}
          style={{lineHeight: '52px', background: '#293542', color: '#ffffff'}}
          theme='dark'
        >
          <Menu.Item key={g_key[0]} className="ant-layout-menu-item">
            <Link to={g_key[0]}>平台对接</Link>
          </Menu.Item>
          <Menu.Item key={g_key[1]} className="ant-layout-menu-item">
            <Link to={g_key[1]}>集团管理</Link>
          </Menu.Item>
          <Menu.Item key={g_key[2]} className="ant-layout-menu-item">
            营销推广
          </Menu.Item>
          <Menu.Item key={g_key[3]} className="ant-layout-menu-item">
            客户管理
          </Menu.Item>
        </Menu>
      </div>
      );
    }
}
