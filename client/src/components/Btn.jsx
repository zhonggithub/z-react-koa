/**
* @Author: Zz
* @Date:   2016-09-24T08:04:56+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T23:15:33+08:00
*/
import { Link } from 'react-router';
import React from 'react';
import { Button, Icon, Menu, Dropdown, Modal, message, InputNumber, } from 'antd';
import querystring from 'querystring';

const confirm = Modal.confirm;

let CreateBtn = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    margin: React.PropTypes.string,
    size: React.PropTypes.string,
    onClick: React.PropTypes.func,
    background: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} className="ant-create-btn" style={{margin: this.props.margin || "10px", ...tmp, background: '#bcbcbc'}}><Icon type="plus" className="icon-margin-btn"/>{this.props.text || '创建'}</a>;
    } else {
      if(!this.props.aLink) {
        return(
            <Link to={this.props.href}
              className="ant-create-btn"
              onClick={this.props.onClick}
              style={{margin: this.props.margin ? this.props.margin: "10px", ...tmp}}
            >
              <Icon type="plus" className="icon-margin-btn"/>{this.props.text || '创建'}
            </Link>
        );
      }
      else {
        return <a href={this.props.href || `javascript:;`} onClick={this.props.onClick} className="ant-create-btn" style={{margin: this.props.margin || "10px", ...tmp}}><Icon type="plus" className="icon-margin-btn"/>{this.props.text || '创建'}</a>;
      }
    }
  }
})

let RefreshBtn = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    margin: React.PropTypes.string,
    size: React.PropTypes.string,
    onClick: React.PropTypes.func,
    background: React.PropTypes.string,
    disabled: React.PropTypes.bool,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} onClick={this.props.onClick} className="ant-refresh-btn" style={{margin: this.props.margin || "10px", ...tmp, background: '#bcbcbc'}}><Icon type="reload" className="icon-margin-btn"/>{this.props.text || '刷新'}</a>;
    } else {
      return <a href={this.props.href|| `javascript:;`} onClick={this.props.onClick} className="ant-refresh-btn" style={{margin: this.props.margin || "10px", ...tmp}}><Icon type="reload" className="icon-margin-btn"/>{this.props.text || '刷新'}</a>;
    }
  }
})

//BatchBtn 必须定义overlay
let BatchBtn = React.createClass({
    propTypes: {
      href: React.PropTypes.string,
      text: React.PropTypes.string,
      margin: React.PropTypes.string,
      size: React.PropTypes.string,
      background: React.PropTypes.string,
      disabled: React.PropTypes.bool,
      //overlay: React.PropTypes.array,
    },

    render(){
      let padding = "5px 7px 5px 5px";
      if(this.props.size === "lagre")
        padding = "8px 15px 8px 8px";
      let tmp = { padding };
      if(this.props.background){
        tmp.background = this.props.background;
      }
      const overlay = this.props.overlay;
      if (this.props.disabled) {
        return (
          <Dropdown overlay={[]}>
            <span className="ant-batch-btn" style={{margin: this.props.margin || "10px", ...tmp, background: '#bcbcbc' }}><Icon type="check-square-o" className="icon-margin-btn"/>{this.props.text || "批量操作"} <Icon type='down'/></span>
          </Dropdown>
        )
      } else {
        return (
          <Dropdown overlay={ overlay }>
            <span className="ant-batch-btn" style={{margin: this.props.margin || "10px", ...tmp }}><Icon type="check-square-o" className="icon-margin-btn"/>{this.props.text || "批量操作"} <Icon type='down'/></span>
          </Dropdown>
        )
     }
  }
});

let DelBtn = React.createClass({
  propTypes : {
    href: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
    background: React.PropTypes.string,
    text: React.PropTypes.string,
  },

  showConfirm() {
    let _this = this;
    confirm({
      title: '确定删除吗?',
      onOk() {
        if(_this.props)
          _this.props.onClick();
      },
      onCancel() {},
    });
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} className="ant-delete-btn" style={{...tmp, background: '#bcbcbc' }}><Icon type="delete" className="icon-margin-btn"/>{this.props.text || '删除'}</a>;
    } else {
      return <a href={this.props.href|| `javascript:;`} onClick={this.showConfirm} className="ant-delete-btn" style={tmp}><Icon type="delete" className="icon-margin-btn"/>{this.props.text || '删除'}</a>;
    }
  }
})

let EditBtn = React.createClass({
  propTypes : {
    href: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
    text: React.PropTypes.string,
    background: React.PropTypes.string,
    icon: React.PropTypes.string,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = {padding: padding};
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} className="ant-edit-btn" style={{...tmp, background: '#bcbcbc'}}><Icon type={this.props.icon||"edit"} className="icon-margin-btn"/>{this.props.text||'编辑'}</a>;
    } else {
      if(!this.props.aLink){
        return (
          <Link
            to={this.props.href}
            className="ant-edit-btn"
            style={tmp}
            onClick={this.props.onClick}
          >
            <Icon type={this.props.icon||"edit"} className="icon-margin-btn"/>{this.props.text || '编辑'}
          </Link>
        )
      } else {
        return <a href={this.props.href|| `javascript:;`} onClick={this.props.onClick} className="ant-edit-btn" style={tmp}><Icon type={this.props.icon||"edit"} className="icon-margin-btn"/>{this.props.text||'编辑'}</a>;
      }
    }
  }
})

let RetrieveBtn = React.createClass({
  propTypes : {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    background: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    if (this.props.disabled) {
      return <a href={`javascript:;`} className="ant-retrieve-btn" style={{background: "#bcbcbc", padding}}><Icon type="info-circle-o" className="icon-margin-btn"/>{this.props.text || "查看详情"}</a>;
    } else {
      if(!this.props.aLink){
        return (
          <Link
            to={this.props.href}
            className="ant-retrieve-btn"
            style={{ padding }}
          >
            <Icon type="info-circle-o" className="icon-margin-btn"/>{this.props.text || "查看详情"}
          </Link>
        )
      } else {
        return <a href={this.props.href|| `javascript:;`} onClick={this.props.onClick} className="ant-retrieve-btn" style={{"background": this.props.background || "#3598dc", padding: padding}}><Icon type="info-circle-o" className="icon-margin-btn"/>{this.props.text || "查看详情"}</a>;
      }
    }
  }
})

let DefBtn = React.createClass({
  propTypes : {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    icon: React.PropTypes.string,
    iconfont: React.PropTypes.element,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
    calssName: React.PropTypes.string,
  },

  render(){
    let className = 'ant-def-btn';
    if (this.props.size === "lagre") {
      className = 'ant-def-btn-lagre';
    }
    let content = (<span><Icon type={this.props.icon} className="icon-margin-btn"/>{this.props.text || "自定义"}</span>);
    if(this.props.iconfont) {
      content = (<span>{this.props.iconfont}{this.props.text || "自定义"}</span>);
    }
    if (this.props.disabled) {
    return <a href={`javascript:;`}  className={this.props.className || className} style={{background: "#bcbcbc"}}>
        {content}
      </a>
    }

    if(!this.props.aLink){
      return (
        <Link to={this.props.href} className={this.props.className || className} onClick={this.props.onClick}>
          {content}
        </Link>
      )
    }

    return(
      <a href={this.props.href|| `javascript:;`} onClick={this.props.onClick} className="ant-def-btn">
        {content}
      </a>
    )
  }
})

let ExportExcelBtn = React.createClass({
  propTypes : {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    background: React.PropTypes.string,
    onClick: React.PropTypes.func,
    size: React.PropTypes.string,
    params: React.PropTypes.object,
    fileName: React.PropTypes.string,
  },

  getInitialState() {
    return {
      unit: 2000,
      begin: 1,
      end: 2000,
      visible: false,
    }
  },

  onClick() {
    if(!this.props.href) {
      message.error(`错误的href!`);
      return;
    }
    const params = {
      ...this.props.params,
      offset: this.state.begin - 1,
      limit: this.state.end - this.state.begin + 1,
    }
    if (this.props.fileName) {
      params.fileName = this.props.fileName;
    }
    delete params.page;
    delete params.pageSize;
    location.href = `${this.props.href}?${querystring.stringify(params)}&token=${sessionStorage.getItem('jwt:token')}`;
    this.setState( {
      unit: 2000,
      begin: 1,
      end: 2000,
    });
  },

  onInputNumberChange(type, value) {
    switch(type) {
      case 'begin': {
        this.setState({
          begin: value,
          end: this.state.begin + this.state.unit - 1,
        });
      }break;
      case 'end': {
        this.setState({
          end: value
        });
      }break;
    }
  },

  showModal() {
    this.setState({
      visible: true,
    });
  },
  handleOk() {
    this.onClick();
    this.setState({
      visible: false,
    });
  },
  handleCancel(e) {
    this.setState({
      visible: false,
    });
  },

  showConfirm() {
    let _this = this;
    const content = <div>
      <InputNumber min={1} step={10} defaultValue={1} onChange={_this.onInputNumberChange.bind(_this, 'begin')}/>
      <span> 至 </span>
      <InputNumber step={10} min={1} max={this.state.begin + this.state.unit - 1} defaultValue={this.state.unit} onChange={_this.onInputNumberChange.bind(_this, 'end')}/>
    </div>;
    Modal.info({
      title: '一次最多只能导出2000条数据',
      content,
      onOk() {
        if(_this.props)
          _this.onClick();
      },
      onCancel() {
      },
    });
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    const content = <div>
      <InputNumber min={1} step={10} defaultValue={1} onChange={this.onInputNumberChange.bind(this, 'begin')}/>
      <span> 至 </span>
      <InputNumber step={10} min={1} max={this.state.begin + this.state.unit - 1} defaultValue={this.state.unit} onChange={this.onInputNumberChange.bind(this, 'end')}/>
    </div>;
    return (
      <span>
        <a href={`javascript:;`} onClick={this.props.onClick || this.showModal} className="ant-export-excel-btn" style={{padding}}><Icon type="file-excel" className="icon-margin-btn"/>{this.props.text || "导出Excel"}</a>
        <Modal title={<span><Icon style={{fontSize: '24px', color: '#108ee9'}} type='info-circle'/><span style={{fontSize: '14px', fontWeight: 'bold', color: '#666'}}> 一次最多只能导出 2000 条数据</span></span>} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          {content}
        </Modal>
      </span>
    )
  }
})

let SyncBtn = React.createClass({
  propTypes: {
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    margin: React.PropTypes.string,
    size: React.PropTypes.string,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} onClick={this.props.onClick} className="ant-sync-btn" style={{margin: this.props.margin || "10px", ...tmp, background: '#bcbcbc'}}><Icon type="retweet" className="icon-margin-btn"/>{this.props.text || '刷新'}</a>;
    } else {
      return <a href={this.props.href || `javascript:;`} onClick={this.props.onClick} className="ant-sync-btn" style={{margin: this.props.margin || "10px", ...tmp}}><Icon type="retweet" className="icon-margin-btn"/>{this.props.text || '刷新'}</a>;
    }
  }
})

let StatusBtn = React.createClass({
  propTypes: {
    text: React.PropTypes.array,
    margin: React.PropTypes.string,
    size: React.PropTypes.string,
    onClick: React.PropTypes.func,
    disabled: React.PropTypes.bool,
    icon: React.PropTypes.array,
    iconfont: React.PropTypes.array,
    status: React.PropTypes.bool,
  },

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "lagre")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    if(this.props.background){
      tmp.background = this.props.background;
    }
    if (this.props.disabled) {
      return <a href={`javascript:;`} onClick={this.props.onClick} className="ant-status-btn" style={{margin: this.props.margin || "10px", ...tmp, background: '#bcbcbc'}}><Icon type="retweet" className="icon-margin-btn"/>{this.props.text[1]}</a>;
    } else {
      if (this.props.status === true) {
        return <a href={`javascript:;`} onClick={this.props.onClick} className="ant-status-btn" style={{margin: this.props.margin || "10px", ...tmp}}><Icon type={this.props.icon[1]} className="icon-margin-btn"/>{this.props.text[1]}</a>;
      }
      return <a href={`javascript:;`} onClick={this.props.onClick} className="ant-status-btn-false" style={{margin: this.props.margin || "10px", ...tmp}}><Icon type={this.props.icon[0]} className="icon-margin-btn"/>{this.props.text[0]}</a>;
    }
  }
})

module.exports = { CreateBtn, RefreshBtn, BatchBtn, DelBtn, EditBtn, RetrieveBtn, DefBtn, ExportExcelBtn, SyncBtn, StatusBtn } ;
