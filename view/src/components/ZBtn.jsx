/**
* @Author: Zz
* @Date:   2016-09-24T08:04:56+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T23:15:33+08:00
*/
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Menu, Dropdown, Modal, message, InputNumber, } from 'antd';
import querystring from 'querystring';

const confirm = Modal.confirm;

class ZBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    type: PropTypes.oneOf([ 'create', 'retrieve', 'refresh', 'edit', 'status', 'batch', 'retrieve', 'sync', 'def' ]),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    text: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]), // 状态按钮为array
    size: PropTypes.oneOf([ 'large', 'small' ]),
    overlay: PropTypes.array, //批量操作按钮
    status: PropTypes.bool, // 态态按钮设置false 样式不一样
    icon: PropTypes.oneOfType([ PropTypes.array, PropTypes.string ]), // 状态按钮为array
  }
  constructor(props) {
    super(props);
  }

  render() {
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "large")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    const tmpStyle = Object.assign({}, { margin: "5px", ...tmp }, this.props.style || {} );
    let btnClassName = "ant-create-btn";
    let btnIcon = "plus";
    let text = this.props.text || '创建';
    switch(this.props.type) {
      case 'create': {
        btnClassName = "ant-create-btn";
        btnIcon = this.props.icon || "plus";
        text = this.props.text || '创建';
        break;
      }
      case 'edit': {
        btnClassName = "ant-edit-btn";
        btnIcon = this.props.icon || "edit";
        text = this.props.text || '编辑';
        break;
      };
      case 'retrieve': {
        btnClassName = 'ant-retrieve-btn';
        btnIcon = this.props.icon || 'info-circle-o';
        text = this.props.text || "查看详情";
        break;
      }
      case 'refresh': {
        btnClassName = 'ant-refresh-btn';
        btnIcon = this.props.icon || 'reload';
        text = this.props.text || '刷新';
        break;
      }
      case 'batch': {
        btnClassName = 'ant-batch-btn';
        btnIcon = this.props.icon || 'check-square-o';
        text = this.props.text || '批量操作';
        break;
      }
      case 'sync': {
        btnClassName = 'ant-sync-btn';
        btnIcon = this.props.icon || 'retweet';
        text = this.props.text || '同步';
        break;
      }
      case 'status': {
        btnClassName = 'ant-status-btn';
        if (this.props.status === false) {
          btnClassName = 'ant-status-btn-false';
        }
        btnIcon = this.props.icon || ['unlock', 'lock'];
        text = this.props.text || ['有效', '无效'];
      }
      default: {
        break;
      }
    }

    switch(this.props.type) {
      case 'create': case 'edit': case 'retrieve': {
        const icon = <Icon type={ btnIcon } className="icon-margin-btn"/>;
        if (this.props.disabled) {
          return <a href={`javascript:;`} className={ btnClassName } style={{...tmpStyle, background: '#bcbcbc'}}>{icon}{ text }</a>;
        }
        return(
          <Link to={this.props.href}
            className={ btnClassName }
            onClick={this.props.onClick}
            style={tmpStyle}
          >
            {icon}{text}
          </Link>
        );
      }
      case 'refresh': case 'sync':{
        const icon = <Icon type={ btnIcon } className="icon-margin-btn"/>;
        if (this.props.disabled) {
          return <a href={`javascript:;`} onClick={this.props.onClick} className={ btnClassName } style={{ ...tmpStyle, background: '#bcbcbc'}}>{icon}{text}</a>;
        } else {
          return <a href={this.props.href|| `javascript:;`} onClick={this.props.onClick} className={ btnClassName } style={tmpStyle}>{icon}{text}</a>;
        }
      }
      case 'batch': {
        const overlay = this.props.overlay || [];
        if (this.props.disabled) {
          return (
            <Dropdown overlay={overlay}>
              <span className={ btnClassName } style={{ ...tmpStyle, background: '#bcbcbc' }}>{icon}{text} <Icon type='down'/></span>
            </Dropdown>
          )
        } else {
          return (
            <Dropdown overlay={ overlay }>
              <span className={ btnClassName } style={tmpStyle}>{icon}{text} <Icon type='down'/></span>
            </Dropdown>
          )
        }
      }
      case 'status': {
        const icon = <Icon type={this.props.status === false ? btnIcon[1] : btnIcon[0]} className="icon-margin-btn"/>
        if (this.props.disabled) {
          return <a href={`javascript:;`} onClick={this.props.onClick} className={btnClassName} style={{...tmpStyle, background: '#bcbcbc'}}>{icon}{text[0]}</a>;
        } else {
          if (this.props.status === false) {
            return <a href={`javascript:;`} onClick={this.props.onClick} className={btnClassName} style={tmpStyle}>{icon}{text[1]}</a>;
          }
          return <a href={`javascript:;`} onClick={this.props.onClick} className={btnClassName} style={tmpStyle}>{icon}{text[0]}</a>;
        }
      }
    }
  }
}

class ZDelBtn extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.oneOf([ 'large', 'small' ]),
    text: PropTypes.string,
    disabled: PropTypes.bool,
  }

  showConfirm = () => {
    const tmpThis = this;
    confirm({
      title: '确定删除吗?',
      onOk() {
        if(tmpThis.props.onClick)
          tmpThis.props.onClick();
      },
      onCancel() {},
    });
  }

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "large")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    const tmpStyle = Object.assign({}, { margin: "5px", ...tmp }, this.props.style || {} );
    
    if (this.props.disabled) {
      return <a href={`javascript:;`} className="ant-delete-btn" style={{...tmpStyle, background: '#bcbcbc' }}><Icon type="delete" className="icon-margin-btn"/>{this.props.text || '删除'}</a>;
    } else {
      return <a href={this.props.href|| `javascript:;`} onClick={this.showConfirm} className="ant-delete-btn" style={tmpStyle}><Icon type="delete" className="icon-margin-btn"/>{this.props.text || '删除'}</a>;
    }
  }
}

class ZDefBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    text: PropTypes.string,
    icon: PropTypes.string,
    iconfont: PropTypes.element,
    onClick: PropTypes.func,
    size: PropTypes.oneOf([ 'large', 'small' ]),
    disabled: PropTypes.bool,
    className: PropTypes.string,
  }

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
        <Link to={this.props.href ||'javascript:;'} className={this.props.className || className} onClick={this.props.onClick}>
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
}

class ZExportExcelBtn extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string,
    onClick: PropTypes.func,
    size: PropTypes.oneOf([ 'large', 'small' ]),
    params: PropTypes.object,
    fileName: PropTypes.string,
  }

  constructor (props) {
    super(props);
    this.state = {
      unit: 2000,
      begin: 1,
      end: 2000,
      visible: false,
    }
  }

  onClick = () => {
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
    
    location.href = `${this.props.href}?${querystring.stringify(params)}&token=${sessionStorage.getItem('jwt:token')}`;
    this.setState( {
      unit: 2000,
      begin: 1,
      end: 2000,
    });
  }

  onInputNumberChange = (type, value) => {
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
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.onClick();
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  showConfirm = () => {
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
  }

  render(){
    let padding = "5px 7px 5px 5px";
    if(this.props.size === "large")
      padding = "8px 15px 8px 8px";
    let tmp = { padding };
    const tmpStyle = Object.assign({}, { margin: "5px", ...tmp }, this.props.style || {} );
    
    const content = <div>
      <InputNumber min={1} step={10} defaultValue={1} onChange={this.onInputNumberChange.bind(this, 'begin')}/>
      <span> 至 </span>
      <InputNumber step={10} min={1} max={this.state.begin + this.state.unit - 1} defaultValue={this.state.unit} onChange={this.onInputNumberChange.bind(this, 'end')}/>
    </div>;
    return (
      <span>
        <a href={`javascript:;`} onClick={this.props.onClick || this.showModal} className="ant-export-excel-btn" style={tmpStyle}><Icon type="file-excel" className="icon-margin-btn"/>{this.props.text || "导出Excel"}</a>
        <Modal title={<span><Icon style={{fontSize: '24px', color: '#108ee9'}} type='info-circle'/><span style={{fontSize: '14px', fontWeight: 'bold', color: '#666'}}> 一次最多只能导出 2000 条数据</span></span>} visible={this.state.visible}
          onOk={this.handleOk} onCancel={this.handleCancel}
        >
          {content}
        </Modal>
      </span>
    )
  }
}

module.exports = { ZBtn, ZDelBtn, ZExportExcelBtn, ZDefBtn } ;
