/*
 * @Author: Zz
 * @Date: 2017-02-28 10:54:03
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-13 21:14:29
 */
import React from 'react';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Alert, message, } from 'antd';
import { ZTable, ZContentHeader, ZBreadcrumb, ZIcon } from '../components';
import { accountStore } from '../stores';
import { CreateBtn, RefreshBtn, ExportExcelBtn, DelBtn, EditBtn, RetrieveBtn, DefBtn, StatusBtn, }  from '../components/ZBtn'

import '../style/style';

@inject("stores") @observer
export default class PageAccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns : [{
        title: 'id',
        dataIndex: 'id',
        className: 'table-column-hidden',
      },{
        title: '用户名',
        dataIndex: 'code',
        className: 'table-column-center',
      },{
        title: '账号',
        dataIndex: 'date',
        className: 'table-column-center',
      },{
        title: 'email',
        dataIndex: 'truckNumber',
        className: 'table-column-center',
      },{
        title: '手机号',
        className: 'table-column-center',
        dataIndex: 'driver'
      },{
        title: '自定义数据',
        className: 'table-column-left',
        dataIndex: 'supercargo',
      },{
        title: '创建时间',
        className: 'table-column-left',
        dataIndex: 'createdAt',
        render: (value, record, index) => {
          return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      },{
        title: '更新时间',
        className: 'table-column-left',
        dataIndex: 'updatedAt',
        render: (value, record, index) => {
          return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss');
        }
      }],
      pagination : {
        showQuickJumper: true,
        showSizeChanger: true,
        defaultCurrent: 1,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showTotal (total) {
          return `共 ${total} 条`;
        }
      },
      accountStore: props.stores.accountStore,
      params: {
        page: 1,
        pageSize: 10,
      },
    };
  }
  componentDidMount() {
    // this.state.accountStore.list();
  }

  onSearch = (value) => {
    const params = {
      ...this.state.params,
    };
    if (value) {
      params.value = value;
    }
    this.state.accountStore.list(params);
  }

  onRefreshBtn = () => {
    this.state.accountStore.list();
  }

  handleTabeChange = (pagination, filters, sorter) => {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    this.setState({ pagination: pager });
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
    }
    this.state.params = params;
    this.state.accountStore.list(params);
  }

  iconClick() {
    console.log('-------');
  }
  
  render() {
    const breadcrumbItems = [
      {
        content: '主页',
        to: '/group/dockingplatform',
        icon: 'home',
      },{
        content: '账号服务',
        to: '/group/dockingplatform/crs',
      },{
        content: '用户列表',
      }
    ];
    this.state.pagination.total = 10;// this.state.accountStore.total;
    return (
      <div className="hms-layout-container">
        <ZBreadcrumb items={breadcrumbItems}/>
        <div className="hms-content-style">
          <ZContentHeader content="用户列表" />
            <ZIcon iconfont='&#xe629;' onClick={this.iconClick}/>
            <CreateBtn margin="0px 5px 0px 0px" size="lagre" href="/zplatorm/sidenav/accountservice/accountedit" />
            <RefreshBtn margin="0px 5px 0px 5px" size="lagre" onClick={this.onRefreshBtn}/>
            <ExportExcelBtn size="lagre" href={`/group/api/groups/${'ll'}/exportexcel/orders`} params={this.state.params} fileName='集团管理-订单管理-无效订单' />
            
            <ZTable
              bordered
              //disableLeftTitle
              //disableColumnMenu
              //disableSearchInput
              size="small"
              searchInputPlaceholder="用户名"
              rowKey={ record => record.id }
              columns={ this.state.columns }
              // loading={ this.state.accountStore.loading }
              // dataSource={ this.state.accountStore.items.slice() }
              pagination={ this.state.pagination }
              onSearch={this.onSearch}
              onChange={this.handleTabeChange}
            />
          </div>
       </div>);
   }
}