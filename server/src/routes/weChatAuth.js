import util from '../common/util';

export default {
  async mpAuth(ctx) {
    const body = ctx.request.body;
    const sendBody = {
      authorizationCode: body.auth_code,
    };
    const retData = await ctx.invoke('wechat-access-token-service', 'component.query.auth', sendBody);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
    }
    ctx.body = retData;
    ctx.status = 200;
  },

  async retrievePreAutCode(ctx) {
    const tokenRet = await Promise.all([
      ctx.invoke('wechat-access-token-service', 'preauthcode.get'),
      ctx.invoke('wechat-access-token-service', 'component.token.get'),
    ]);
    if (tokenRet[0].code !== 0 && tokenRet[1].code !== 0) {
      util.packageRet200(ctx, tokenRet[0].code !== 0 ? tokenRet[0] : tokenRet[1]);
      return;
    }
    const preAuth = tokenRet[0].data;
    const token = tokenRet[1].data;
    const wxAuthURL = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage';
    const retData = {
      code: 0,
      message: 'success',
      data: {
        authPageURL: `${wxAuthURL}?component_appid=${token.componentAppid}&pre_auth_code=${preAuth.preAuthCode}&redirect_uri=`,
      },
    };
    ctx.status = 200;
    ctx.body = retData;
  },
};
