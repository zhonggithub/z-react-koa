/**
* @Author: Zz
* @Date:   2016-09-21T20:57:51+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-08T22:35:01+08:00
*/
import React from 'react';
import { browserHistory} from 'react-router';
import { Button, Form, Input, Checkbox, message } from 'antd';
import { appStore, } from '../stores';
import 'antd/dist/antd.less';
import './style.less';

const createForm = Form.create;
const FormItem = Form.Item;

function noop() {
  return false;
}

let Login = React.createClass({
  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  getInitialState() {
    return {
      data: {},
    }
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      let _this = this;
      appStore
        .login(values)
        .then(rst => {
          appStore.token = rst.token;
          appStore.payload = rst.payload;
          location.href = '/group/dockingplatform/weixin/interface';// '/group/dockingplatform/overview/datacount';
        })
        .catch(err => {
          this.setState({
            error: err.message,
          });
          message.error(err.message);
        });
   });
  },

  onChange(e){
    console.log(e.target.checked);
  },

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
       <div style={{"display": "flex", "justifyContent": "center"}}>
         <div className="ant-layout-login">
          <h3 className="ant-form-title">登  录</h3>
          <Form horizontal>
            <FormItem
              {...formItemLayout}
              label="账号"
              hasFeedback
              >
              {
                getFieldDecorator('account', {
                  rules: [
                    { required: true, min: 1, message: '请填写账号！' },
                  ],
                })(
                  <Input size="large" placeholder="请输入账号" />
                )
              }
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="密码"
              hasFeedback
              >
              {
                getFieldDecorator('password', {
                  rules: [
                    { required: true, whitespace: true, message: '请填写密码！' }
                  ],
                })(
                  <Input size="large" type="password" autoComplete="off" placeholder="请输入密码"
                    onContextMenu={noop} onPaste={noop} onCopy={noop} onCut={noop}
                    />
                )}
            </FormItem>

            <FormItem
              wrapperCol={{ offset: 13 }}
              >
                {/*<label>
                <Checkbox defaultChecked={false} {...getFieldDecorator('remember', {valuePropName: 'unchecked'})} />记住
              </label>
              &nbsp;&nbsp;&nbsp;
                <Button type="ghost" onClick={this.handleReset}>重置</Button>*/}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button type="primary" onClick={this.handleSubmit}>登录</Button>
            </FormItem>
            </Form>
          </div>
        </div>
    );
  },
});

Login = createForm()(Login);
module.exports = Login;
