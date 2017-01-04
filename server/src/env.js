/**
* @Author: Zz
* @Date:   2016-09-27T20:03:49+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-09-27T21:26:33+08:00
*/
import dotenv from 'dotenv';

// istanbul ignore next
if (process.env.NODE_ENV === 'production') {
  dotenv.config({
    path: `${__dirname}/../.env`,
  });
}

// istanbul ignore next
if (process.env.NODE_ENV === 'test') {
  process.env = {
    NODE_ENV: 'test',
    ACCOUNT_DOMAIN: 'http://service.local/hms-account-service:3000',
    GROP_DOMAIN: 'http://service.local/hms-group-service:3000',
    PORT: 3001,
    LOG_LEVEL: 'fatal',
    MONGO_DB: 'mongodb://127.0.0.1/hms-order-test',
    JWT_KEY: 'hms-group-console-server',
    UPLOAD_DIR: `${__dirname}/public`,
    CDN_HOST: 'ias.oss-cn-hangzhou.aliyuncs.com',
    UPLOAD_ROOT: '/uploads',
    OSS_ACCESS_KEY: '123',
  };
}
