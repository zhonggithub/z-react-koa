/*
 * @Author: Zz
 * @Date: 2017-05-19 15:16:40
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-22 13:46:25
 */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Input, Icon, Row, Button, Menu } from 'antd';

function noop() {
  return false;
}

@inject('stores') @observer
class PageLogin1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      codeUrl: '/zPlatorm/api/code',
      current: 'account',
      isShowErrorText: false,
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (this.state.current === 'account') {
        if (!values.account) {
          this.setState({ errorText: '请输入账号嗯！', isShowErrorText: true, });
          return;
        }
        if (!values.password) {
          this.setState({ errorText: '请输入密码哦！', isShowErrorText: true,});
          return;
        }
        if (!values.verificationCode) {
          this.setState({ errorText: '请输入验证码啦！', isShowErrorText: true,});
          return;
        }
      } else {
        if (!values.mobile) {
          this.setState({ errorText: '请输入手机号嗯！', isShowErrorText: true,});
          return;
        }
        if (!values.code) {
          this.setState({ errorText: '请输入验证码啦！', isShowErrorText: true,});
          return;
        }
      }
      
      const appStore = this.props.stores.appStore;
      appStore.login(values);
   }); 
  }
  renderErrorTitle() {
    if (!this.state.errorText || !this.state.isShowErrorText) {
      return null;
    }
    const rowStyle = { marginLeft: '28px', marginTop: '50px'};
    return (
      <Form.Item>
        <Row style={rowStyle}>
          <div className="sl-error sl-error-display"><span className="sl-error-text">{this.state.errorText}</span></div>
        </Row>
      </Form.Item>
    );
  }
  changeCode = () => {
    this.setState({ codeUrl: `${this.state.codeUrl}?t=${Date.now()}`});
  }
  handleClick = (e) => {
    this.setState({
      current: e.key,
      isShowErrorText: false,
      errorText: '',
    });
  }
  handleKeyPress = (e) => {
    switch (e.key) {
      case 'Enter':
        this.handleSubmit(e);
        break;
    }
  }
  renderAccountLayout = () => {
    if (this.state.current !== 'account') {
      return null;
    }
    const { getFieldDecorator } = this.props.form;
    const rowStyle = { marginLeft: '28px', marginTop: '20px'};
    return (
      <div>
        <Form.Item>
          <Row style={ !this.state.errorText ? {...rowStyle, marginTop: '50px'} : {...rowStyle, marginTop: '-10px'}}>
            {
              getFieldDecorator('account')(
                  <Input size="large" style={{ width: '260px'}} prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号／手机号／邮箱" />
                )
            }
          </Row>
        </Form.Item>
        <Form.Item>
          <Row style={{...rowStyle, marginTop: '-10px'}}>
            {
              getFieldDecorator('password')(
                <Input size="large" style={{ width: '260px'}} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" autoComplete="off" placeholder="密码"
                  onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                  />
            )}
          </Row>
        </Form.Item>
        <Form.Item>
          <Row style={{...rowStyle, marginTop: '-10px',}}>
            {
              getFieldDecorator('verificationCode')(
                <Input size="large" style={{ width: '100px', float: 'left'}} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} autoComplete="off" onKeyPress={this.handleKeyPress} placeholder="验证码"
                  />
            )}
            <span className='code-style'>
            <img className='image-code-style' src={this.state.codeUrl} />
            </span>
            <a className='a-style' onClick={this.changeCode}>换一张</a>
          </Row>
        </Form.Item>
      </div>
    );
  }

  renderMobileLayout = () => {
    if (this.state.current !== 'mobile') {
      return null;
    }
    const { getFieldDecorator } = this.props.form;
    const rowStyle = { marginLeft: '28px', marginTop: '20px'};
    return (
      <div>
        <Form.Item>
          <Row style={ !this.state.errorText ? {...rowStyle, marginTop: '50px'} : {...rowStyle, marginTop: '-10px'}}>
            {
              getFieldDecorator('mobile')(
                  <Input size="large" style={{ width: '260px'}} prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="手机号" />
                )
            }
          </Row>
        </Form.Item>
        <Form.Item>
          <Row style={{...rowStyle, marginTop: '-10px',}}>
            {
              getFieldDecorator('code')(
                <Input size="large" style={{ width: '160px', float: 'left'}} prefix={<Icon type="lock" style={{ fontSize: 13 }} />} autoComplete="off" placeholder="验证码" onKeyPress={this.handleKeyPress}
                  />
            )}
            <a className='a-style' onClick={this.changeCode}>动态验证码</a>
          </Row>
        </Form.Item>
      </div>
    );
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const rowStyle = { marginLeft: '28px', marginTop: '20px'};
    let style = {};
    if (this.state.current === 'account') {
      style = this.state.errorText ? { height: '275px'} : {};
    } else {
      style = this.state.errorText ? { height: '225px' } : { height: '185px' };
    }

    return (
      <div className='page-login'>
        <div className='page-login-layout' style={ style }>
          <Menu
            mode="horizontal"
            onClick={this.handleClick}
            selectedKeys={ [this.state.current] }
          >
            <Menu.Item key="account" style={{ zIndex: 1, fontSize: '16px' }}>
              <Icon type="user" />账号登入
            </Menu.Item>

            <Menu.Item key="mobile" style={{ float: 'right', zIndex: 1, fontSize: '16px' }}>
              <Icon type="mobile" />手机登入
            </Menu.Item>
          </Menu>
          <Form style={{ marginTop: '-40px' }}>
            { this.renderErrorTitle() }
            { this.renderAccountLayout() }
            { this.renderMobileLayout() }
            <Form.Item
              wrapperCol={{ offset: 18 }}
              >
              <Row style={{marginTop: '-20px'}}>
                <Button type="primary" onClick={this.handleSubmit}>登录</Button>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </div>
      );
  }
}

export default Form.create()(PageLogin1);