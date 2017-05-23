/*
 * @Author: Zz
 * @Date: 2017-05-23 11:23:17
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 11:26:17
 */
import _ from 'lodash';
import RSMQWorker from 'rsmq-worker';
import { config as Config, logger as Logger } from './common';

// 实例化对象
const logger = Logger('queue');

// worker define
const options = _.defaults(Config.queue, {
  interval: [0, 1, 5],
  timeout: 1000 * 60 * 2,
});

const worker = new RSMQWorker(Config.queue.qname, options);
worker.on('message', (msg, next) => {
  msg = JSON.parse(msg);
  next();
  // request.post({ url: msg.path, body: msg.data, json: true, timeout: 10 * 1000 }, (err, response, body) => {
  //   if (err || body.code !== 0) {
  //     logger.info('messageId: %s, msg: %s, error : ', id, JSON.stringify(msg), err || body);
  //     worker.del(id);
  //   }
  //   next();
  // });
});

// optional error listeners
worker.on('error', (err, msg) => {
  logger.error('Queue Error', err, msg);
  process.exit(-1);
});

worker.on('exceeded', (msg) => {
  logger.warn('Queue Exceeded', msg);
});

worker.on('timeout', (msg) => {
  logger.warn('Queue Timeout', msg);
});

worker.start();
