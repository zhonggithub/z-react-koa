/*
 * @Author: Zz
 * @Date: 2017-03-19 11:01:44
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 10:05:02
 */
import Redis from 'ioredis';
import Store from 'koa-session2/libs/store';
import config from '../config';

export default class RedisStore extends Store {
  constructor() {
    super();
    this.redis = new Redis(config.session.redis);
  }

  async get(sid) {
    const data = await this.redis.get(`${config.session.prefix}:${sid}`);
    return JSON.parse(data);
  }

  async set(session) {
    const sid = this.getID(24);
    await this.redis.set(`${config.session.prefix}:${sid}`, JSON.stringify(session));
    return sid;
  }

  async destroy(sid) {
    const data = await this.redis.del(`${config.session.prefix}:${sid}`);
    return data;
  }
}

