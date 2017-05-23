/*
 * @Author: Zz
 * @Date: 2017-05-23 11:09:46
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 11:11:07
 */
import winston from 'winston';
import moment from 'moment';
import path from 'path';
import fs from 'fs';

const logPath = path.join(__dirname, '../../log');
if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}
module.exports = (fileName) => {
  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({
        level: 'debug',
        colorize: false,
        json: false,
        prettyPrint: true,
        filename: `${logPath}${fileName}.log`,
        timestamp: () => moment().format('YYYY-MM-DD HH:mm:ss'),
      }),
    ],
  });
  return logger;
};
