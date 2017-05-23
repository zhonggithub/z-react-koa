/*
 * @Author: Zz
 * @Date: 2017-05-14 22:37:10
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 10:31:08
 */
import Redis from 'ioredis';
import config from '../config';

const redis = new Redis(config.cache);

export default class Cache {
  // constructor() {
  //   // this.redis = new Redis(config.cache);
  // }

  static async set(key, data, time = 60) {
    const dataStr = JSON.stringify(data);
    const multi = redis.multi();
    multi.set(key, dataStr);
    multi.expire(key, time);
    return multi.exec();
  }

  static async get(key) {
    let result = await redis.get(key);
    if (result && result !== null && result !== '') {
      result = JSON.parse(result);
    } else {
      result = false;
    }
    return result;
  }

  static async del(key) {
    return redis.del(key);
  }
}
