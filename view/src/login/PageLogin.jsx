/**
* @Author: Zz
* @Date:   2016-09-21T20:57:51+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T22:35:01+08:00
*/
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Form, Input, Checkbox, message, Icon, Tabs } from 'antd';

import './style.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

function noop() {
  return false;
}

@inject("stores") @observer
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: '1',
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors && this.state.key === '1' && (errors.account || errors.password)) {
        return;
      }
      if (!!errors && this.state.key === '2' && (errors.mobile || errors.code)) {
        return;
      }
      const appStore = this.props.stores.appStore;
      appStore
        .login(values)
        .then(rst => {
          appStore.token = rst.data.token;
          appStore.payload = rst.data.user;
          // location.href = '/zplatorm/sidenav/accountservice/account';
        }).catch(err => {
          this.setState({
            error: err.message,
          });
          message.error(err.message);
        });
   });
  }
  handleTabChange = (key) => {
    this.state.key = '2';
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
       <div style={{"display": "flex", "justifyContent": "center"}}>
         <div className="ant-layout-login">
          <Tabs type="card" onChange={this.handleTabChange}>
            <TabPane tab="普通登入" key="1">
              <Form layout="horizontal">
                <FormItem>
                  {
                    getFieldDecorator('account', {
                      rules: [
                        { required: true, min: 1, message: '请填写账号／手机号／邮箱！' },
                      ],
                    })(
                      <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="账号／手机号／邮箱" />
                    )
                  }
                </FormItem>

                <FormItem>
                  {
                    getFieldDecorator('password', {
                      rules: [
                        { required: true, whitespace: true, message: '请填写密码！' }
                      ],
                    })(
                      <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" autoComplete="off" placeholder="请输入密码"
                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                        />
                    )}
                </FormItem>

                <FormItem
                  wrapperCol={{ offset: 11 }}
                  >
                    <label>
                      <Checkbox defaultChecked={false} {...getFieldDecorator('remember', {valuePropName: 'unchecked'})} >记住密码</Checkbox>
                    </label>
                  {/*&nbsp;&nbsp;&nbsp;
                    <Button type="ghost" onClick={this.handleReset}>重置</Button>*/}
                    &nbsp;&nbsp;&nbsp;
                    <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                </FormItem>
              </Form>
            </TabPane>
            <TabPane tab="验证码登入" key="2">
              <Form layout="horizontal">
                <FormItem>
                  {
                    getFieldDecorator('mobile', {
                      rules: [
                        { required: true, min: 1, message: '请填写手机号！' },
                      ],
                    })(
                      <Input prefix={<Icon type="mobile" style={{ fontSize: 13 }} />} placeholder="手机号" />
                    )
                  }
                </FormItem>

                <FormItem>
                  {
                    getFieldDecorator('code', {
                      rules: [
                        { required: true, whitespace: true, message: '请填写验证码！' }
                      ],
                    })(
                      <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" autoComplete="off" placeholder="请输入验证码"
                        onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                        />
                    )}
                </FormItem>

                <FormItem
                  className="form-login-btn"
                  wrapperCol={{ offset: 11 }}
                  >
                    <Button type="primary" onClick={this.handleSubmit}>登录</Button>
                </FormItem>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
};

const PageLogin = Form.create()(Login);
module.exports = PageLogin;
