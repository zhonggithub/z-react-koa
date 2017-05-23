/*
 * @Author: Zz
 * @Date: 2017-05-23 09:59:46
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 11:04:18
 */
export default {
  session: {
    redis: {
      host: 'localhost',
      port: 6379,
      options: {
        dropBufferSupport: true,
      },
    },
    prefix: 'z-react-koa',
  },
  cache: {
    keyPrefix: 'z-react-koa:cache:',
    ttl: 120,
    host: 'localhost',
    port: 6379,
    dropBufferSupport: true,
  },
  queue: {
    qname: 'z-react-koa:queue',
    host: 'localhost',
    port: 6379,
    dropBufferSupport: true,
    options: {},
  },
};
