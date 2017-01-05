import React from 'react';
import { Table, Menu, Checkbox, Dropdown, BackTop, Button, Icon, } from 'antd';

import '../style/style.less';

export default class ZTable extends React.Component {
  static propsType = {
    disableLeftTitle: React.PropTypes.bool,
    disableColumnMenu: React.PropTypes.bool,
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    }
  }

  menuItem(){
    const columns = this.props.columns;
    if(!columns)
      return null;
    return columns.map((item) => {
      return(
        <Menu.Item key={item.title}>
          <Checkbox defaultChecked={item.className === 'table-column-hidden' ? false : true} onChange={this.checkboxOnChange.bind(this, item.title)}>
            {item.title}
          </Checkbox>
        </Menu.Item>
      );
    })
  }
  checkboxOnChange(item, e){
    let columns = this.props.columns;
    for(let i = 0; i < columns.length; ++i){
      if(columns[i].title === item) {
        if (e.target.checked) {
          if (columns[i].preClassName)
            columns[i].className = columns[i].preClassName;
          else {
            columns[i].className = columns[i].defaultClassName || 'table-column-center';
          }
        } else {
          columns[i].preClassName = null;
          columns[i].preClassName = new String(columns[i].className);
          columns[i].className = 'table-column-hidden';
        }
        this.setState({ columns });
        return;
      }
    }
  }
  columnsDownMenu(){
    return (
      <Menu>
        {this.menuItem()}
      </Menu>
    );
  }

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
  }

  renderItemCountTitle() {
    if (!this.props.pagination || this.props.disableLeftTitle) {
      return null;
    }
    const pagination = this.props.pagination;
    const begin = (pagination.current - 1) * pagination.pageSize || 1;
    const end = (pagination.current) * pagination.pageSize > pagination.total ? pagination.total : (pagination.current) * pagination.pageSize || 10;
    const total = pagination.total;
    return <span>显示第 {begin} 至 {end} 项结果，共 {total} 项</span>
  }

  renderDownMenu() {
    if (!this.props.columns || this.props.disableColumnMenu) {
      return null;
    }
    return <div className={ this.props.disableLeftTitle ? "hms-table-column-col-select-span" : "hms-table-column-col-select-span-1"}>
            <Dropdown
              onVisibleChange={this.handleVisibleChange}
              visible={this.state.visible}
              overlay={this.columnsDownMenu()}
              trigger={['click']}
            >
              <Button type="ghost" style={{ marginLeft: 8 }}>
                选择列 <Icon type="down" />
              </Button>
            </Dropdown>
          </div>
  }

  render() {
    return (
      <div>
        <div style={{ paddingTop: '23px' }}>
          { this.renderItemCountTitle() }
          { this.renderDownMenu() }
          <Table
            { ...this.props }
          />
        </div>
        <BackTop/>
      </div>
    );
  }
}