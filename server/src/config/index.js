export default {
  utuappDomain: process.env.NODE_ENV === 'production' ? 'http://www.utuapp.cn/api/gateway/index' : 'http://test.utuapp.cn/api/gateway/index',
  JWT_KEY: process.env.JWT_KEY || 'group-console',
  tokenAccessIpWhiteList: process.env.GROUP_LOGIN_IP_LIST ? process.env.GROUP_LOGIN_IP_LIST.split(',') : ['120.25.57.223'],
};
