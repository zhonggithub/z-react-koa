import React from 'react';
import { Table, Menu, Checkbox, Dropdown, BackTop, Button, Icon, } from 'antd';
import SearchInput from './SearchInput';

import '../style/style.less';

export default class ZTable extends React.Component {
  static propsType = {
    disableLeftTitle: React.PropTypes.bool,
    disableColumnMenu: React.PropTypes.bool,
    disableSearchInput: React.PropTypes.bool,
    searchInputPlaceholder: React.PropTypes.string,
    onSearch: React.PropTypes.func,
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
    const end = (pagination.current) * pagination.pageSize > pagination.total ? pagination.total : (pagination.current) * pagination.pageSize || pagination.defaultPageSize;
    const total = pagination.total;
    return <span>显示第 {begin} 至 {end} 项结果，共 {total} 项</span>
  }

  renderDownMenu() {
    if (!this.props.columns || (this.props.disableColumnMenu && this.props.disableSearchInput)) {
      return null;
    }
    return <div className="hms-table-column-col-select-span-1">
            { this.props.disableSearchInput ? null : <SearchInput placeholder={ this.props.searchInputPlaceholder ||''}
              onSearch={this.props.onSearch} style={{ width: 200, marginTop: this.props.disableColumnMenu ? '0px' : '-4px' }}
            />}
            { this.props.disableColumnMenu ? null: <Dropdown
              onVisibleChange={this.handleVisibleChange}
              visible={this.state.visible}
              overlay={this.columnsDownMenu()}
              trigger={['click']}
            >
              <Button type="ghost" style={{ marginLeft: 8 }}>
                选择列 <Icon type="down" />
              </Button>
            </Dropdown>}
            
          </div>
  }

  render() {
    return (
      <div>
        <div style={{ paddingTop:  this.props.disableColumnMenu ? '0px' : '23px' }}>
          { this.renderItemCountTitle() }
          { this.renderDownMenu() }
          <div style={{ marginTop: this.props.disableLeftTitle && !this.props.disableColumnMenu ? '18px' : '0px'}}>
            <Table
              { ...this.props }
            />
          </div>
        </div>
        <BackTop/>
      </div>
    );
  }
}