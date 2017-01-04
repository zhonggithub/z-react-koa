/**
* @Author: Zz
* @Date:   2016-09-27T20:03:49+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-01T23:36:02+08:00
*/
import fs from 'fs';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import util from '../common/util';
import config from '../config';
import { AccountConvert } from '../common/dataConvert';

function accountFetch(data) {
  return util.fetchPost(process.env.ACCOUNT_DOMAIN, data);
}

// function isExistGroupUploadDir() {
//   let dir = `${process.env.UPLOAD_DIR}/group-console`;
//   if (process.env.NODE_ENV === 'test') {
//     dir = `${__dirname}/../../public/group-console`;
//   }
//   return new Promise((resolve, reject) => {
//     fs.stat(dir, (err) => {
//       if (err === null) {
//         resolve(true);
//       } else if (err.code === 'ENOENT') {
//         resolve(false);
//       } else {
//         reject(err);
//       }
//     });
//   });
// }
//
// function createGroupUploadDir() {
//   let dir = `${process.env.UPLOAD_DIR}`;
//   if (process.env.NODE_ENV === 'test') {
//     dir = `${__dirname}/../../public`;
//   }
//   return new Promise((resolve, reject) => {
//     fs.mkdir(dir, 755, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(true);
//       }
//     });
//   });
// }

function isExistDir(user) {
  let dir = `${process.env.UPLOAD_DIR}/${user}`;
  if (process.env.NODE_ENV === 'test') {
    dir = `${__dirname}/../../public/${user}`;
  }
  return new Promise((resolve, reject) => {
    fs.stat(dir, (err) => {
      if (err === null) {
        resolve(true);
      } else if (err.code === 'ENOENT') {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
}

function createDir(user) {
  let dir = `${process.env.UPLOAD_DIR}/${user}`;
  if (process.env.NODE_ENV === 'test') {
    dir = `${__dirname}/../../public/${user}`;
  }
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, 755, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
}

// function isExistWXDir(user) {
//   let dir = `${process.env.MP_VERIFY_DIR}/${user}`;
//   if (process.env.NODE_ENV === 'test') {
//     dir = `${__dirname}/../../public/${user}`;
//   }
//   return new Promise((resolve, reject) => {
//     fs.stat(dir, (err) => {
//       if (err === null) {
//         resolve(true);
//       } else if (err.code === 'ENOENT') {
//         resolve(false);
//       } else {
//         reject(err);
//       }
//     });
//   });
// }
//
// function createWXDir(user) {
//   let dir = `${process.env.MP_VERIFY_DIR}/${user}`;
//   if (process.env.NODE_ENV === 'test') {
//     dir = `${__dirname}/../../public/${user}`;
//   }
//   return new Promise((resolve, reject) => {
//     fs.mkdir(dir, 755, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(true);
//       }
//     });
//   });
// }

export default {
  async create(ctx) {
    const info = ctx.request.body;
    const data = AccountConvert.create2ServerInfo(info);
    const retData = await accountFetch(data);
    util.packageRet201(ctx, retData, AccountConvert.toClientInfo);
  },

  async signIn(ctx) {
    const info = ctx.request.body;
    info.ip = ctx.ip;
    const data = AccountConvert.login2ServerInfo(info);
    const retData = await ctx.invoke('hms-account-service', 'account.login', data);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    const payload = {
      iat: parseInt(Date.now() / 1000, 10) + parseInt(process.env.JWT_TTL || 7200, 10),
      u: retData.data.UserName,
      t: retData.data.TID,
      r: retData.data.Roles,
    };
    const token = jwt.sign(payload, config.JWT_KEY);
    retData.token = token;
    retData.payload = payload;
    ctx.request.token = payload;

    ctx.session = {
      t: retData.data.TID,
    };

    // 创建该用户的文件夹
    // const isGroupUploadExist = await isExistGroupUploadDir();
    // if (!isGroupUploadExist) {
    //   await createGroupUploadDir();
    // }
    const isExist = await isExistDir(retData.data.UserName);
    if (!isExist) {
      await createDir(retData.data.UserName);
    }

    util.packageRet200(ctx, retData, AccountConvert.toClientInfo);
  },

  async signOut(ctx) {
    ctx.request.token = null;
    ctx.session.t = null;
    ctx.body = JSON.stringify({
      code: 0,
      message: 'success',
      data: {
        token: null,
      },
    });
  },

  async retrieveAccessToken(ctx) {
    const { groupId, accountId, sign } = ctx.request.body;
    let isOk = false;
    for (const ip of config.tokenAccessIpWhiteList) {
      if (ip === ctx.ip) {
        isOk = true;
        break;
      }
    }
    if (!isOk) {
      ctx.throw({ code: '-3', message: '无权限访问！' }, 500);
      return;
    }
    const secretInfo = await ctx.invoke('hms-group-service', 'group.get.app', { id: groupId });
    if (secretInfo.code !== 0) {
      ctx.throw(secretInfo, 500);
      return;
    }
    const tmpSign = util.md5Encode(`${groupId}${accountId}${secretInfo.data.secret}`).toLowerCase();
    if (tmpSign !== sign) {
      ctx.throw({ code: '-1', message: '数据签名错误！' }, 500);
      return;
    }
    const payload = {
      iat: parseInt(Date.now() / 1000, 10) + parseInt(process.env.JWT_TTL || 7200, 10),
      u: '',
      t: groupId,
      r: '',
      accountId,
      time: moment().unix(),
    };
    const token = jwt.sign(payload, config.JWT_KEY);

    ctx.body = { code: 0, message: 'success', data: { token } };
    ctx.status = 200;
  },

  async groupLogin(ctx) {
    const { token } = ctx.request.body;
    const tokenData = jwt.verify(token, process.env.JWT_KEY || 'group-console');

    const { t, accountId, time } = tokenData;
    const tmpTime = moment().unix();
    // token 一分钟有效
    if ((tmpTime - Number(time)) > 60) {
      ctx.throw({ code: '-2', message: 'token已过期！' }, 500);
      return;
    }

    const info = {
      id: accountId,
      TID: t,
    };
    const retData = await ctx.invoke('hms-account-service', 'account.get', info);
    if (retData.code !== 0) {
      ctx.throw(retData, 500);
      return;
    }
    const payload = {
      iat: parseInt(Date.now() / 1000, 10) + parseInt(process.env.JWT_TTL || 7200, 10),
      u: retData.data.UserName,
      t: retData.data.TID,
      r: retData.data.Roles,
    };

    retData.token = jwt.sign(payload, config.JWT_KEY);
    retData.payload = payload;
    ctx.request.token = payload;

    ctx.session = {
      t: retData.data.TID,
    };

    const isExist = await isExistDir(retData.data.UserName);
    if (!isExist) {
      await createDir(retData.data.UserName);
    }
    util.packageRet200(ctx, retData, AccountConvert.toClientInfo);
  },
};
