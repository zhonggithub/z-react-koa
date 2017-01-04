import request from './request';

class AppStore {
  get token() {
    return sessionStorage.getItem('jwt:token');
  }

  set token(val) {
    sessionStorage.setItem('jwt:token', val);
  }

  get payload() {
    return JSON.parse(sessionStorage.getItem('jwt:payload'));
  }

  set payload(val) {
    sessionStorage.setItem('jwt:payload', JSON.stringify(val));
  }

  get isLogin() {
    if(this.token === 'undefined')
      return false;
    return !!this.token;
  }

  login(params) {
    return request('/group/api/login', params).then(res => {
      if (res.status !== 200) {
        return res.json().then(rst => {
          throw new Error(`[${rst.code}] ${rst.message}`);
        });
      }
      return res.json();
    });
  }

  groupLogin(params) {
    return request('/group/api/login/group', params).then(res => {
      if (res.status !== 200) {
        return res.json().then(rst => {
          throw new Error(`[${rst.code}] ${rst.message}`);
        });
      }
      return res.json();
    });
  }

  logout() {
    return request('/group/api/logout', {}).then(res => {
      if (res.status !== 200) {
        return res.json().then(rst => {
          throw new Error(`[${rst.code}] ${rst.message}`);
        });
      }
      return res.json();
    });
  }
}

export default new AppStore();
