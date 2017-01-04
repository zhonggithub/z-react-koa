import test from 'ava';
import jwt from 'jsonwebtoken';
import request from '../helpers/request';
import fetchMock from 'fetch-mock';

const token = jwt.sign({ u: 'demo' }, process.env.JWT_KEY);

test.afterEach.always(t => {
  fetchMock.restore();
});

test.serial('post /group/api/wx/mpauth ok', async(t) => {
  fetchMock.mock('^http://service.local/wechat-access-token-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method){
      case 'component.query.auth':
       return {
         code: 0,
         message: 'success',
         data: {
           appid: "wxf8b4f85f3a794e77",
           nickName: '微信SDK Demo Special',
           headImg: 'http://wx.qlogo.cn/mmopen/GPyw0pGicibl5Eda4GmSSbTguhjg9LZjumHmVjybjiaQXnE9XrXEts6ny9Uv4Fk6hOScWRDibq1fI0WOkSaAjaecNTict3n6EjJaC/0',
           userName: 'gh_eb5e3a772040',
           serviceTypeInfo: 2,
           verifyTypeInfo: 0,
           alias: 'paytest01',
           businessInfo: {"openStore": 0, "openScan": 0, "openPay": 0, "openCard": 0, "openShake": 0},
           funcInfo: [1, 2, 3],
           qrcodeUrl: 'URL',
         },
       };
     }
  });

  const res = await request.post('/group/api/wx/mpauth').send({auth_code:1221}).set('token', token);
  if (res.status >= 400) console.log(res.text);
  //console.log(res.body);
  t.is(res.status, 200);
});

test.serial('GET /group/api/wx/retrieveauth ok', async(t) => {
  fetchMock.mock('^http://service.local/wechat-access-token-service', (url, opts) => {
    const body = JSON.parse(opts.body);
    switch(body.method){
      case 'preauthcode.get': {
        return {
          code: 0,
          message: 'success',
          data: {
            componentAppid: '57de55213e442a17287ecd67',
            componentAccessToken: 'zz',
          }
        }
       };
       case 'component.token.get': {
         return {
           code: 0,
           message: 'success',
           data: {
             preAuthCode: '57de55213e442a17287ecd67',
             expiresIn: 1200,
           }
         }
       };
     }
  });
  const res = await request.get('/group/api/wx/retrieveauth').set('token', token);
  if (res.status >= 400) console.log(res.text);
  t.is(res.status, 200);
});
