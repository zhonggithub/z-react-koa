/*
 * @Author: Zz
 * @Date: 2017-03-09 11:38:46
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 11:06:07
 */
import _ from 'lodash';
import RedisSMQ from 'rsmq';
import promisify from 'es6-promisify';
import config from '../config';

class Mq {
  constructor() {
    this.options = _.defaults(config.queue, {
      ns: 'rsmq',
      qname: 'queue',
    });
    const rsmq = new RedisSMQ(this.options);
    rsmq.createQueue({ qname: this.options.qname }, () => {});

    this.sendMessage = promisify(rsmq.sendMessage);
    this.getQueueAttributesImp = promisify(rsmq.getQueueAttributes);
    this.rsmq = rsmq;
    this.qname = this.options.qname;
  }

  getQueueAttributes() {
    return this.getQueueAttributesImp({ qname: this.options.qname });
  }

  add(path, data, delay) {
    const msgBody = JSON.stringify({
      path: path.toLowerCase(),
      data,
    });
    if (delay) {
      delay = parseInt(delay, 10) || 0;
    }
    if (delay <= 0) {
      return this.sendMessage({ qname: this.options.qname, message: msgBody });
    }
    return this.sendMessage({ qname: this.options.qname, message: msgBody, delay });
  }
}

module.exports = new Mq();
