/*
 * @Author: Zz
 * @Date: 2017-04-12 20:55:50
 * @Last Modified by: Zz
 * @Last Modified time: 2017-04-12 21:56:48
 */
import { observable, computed } from 'mobx';
import { message } from 'antd';
import { request, functionPool, config } from '../common';

class AppStore {
  @computed get token() {
    return sessionStorage.getItem('jwt:token');
  }

  set token(val) {
    sessionStorage.setItem('jwt:token', val);
  }

  @computed get payload() {
    return JSON.parse(sessionStorage.getItem('jwt:payload'));
  }

  set payload(val) {
    sessionStorage.setItem('jwt:payload', JSON.stringify(val));
  }

  @computed get isLogin() {
    if(this.token === 'undefined' || this.token === 'null')
      return false;
    return !!this.token;
  }

  login(params) {
    const url = `${config.apiPrefix}/login`;
    request(url, params).then(functionPool.package200).then(ret =>{
      this.payload = ret.data.user;
      this.token = ret.data.token;
      location.href = '/index';
    }).catch(err => {
      message.error(`登入失败! ${err}`);
    });
  }

  logout() {
    const url = `${config.apiPrefix}/logout`;
    return request(url, {}).then(functionPool.package200).then(ret => {
      // this.payload = null;
      this.token = null;
      location.href = '/';
    }).catch(err => {
      message.error(`登出失败! ${err}`);
    });
  }
}

export default new AppStore();
