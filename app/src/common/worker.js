/*
 * @Author: Zz
 * @Date: 2017-05-23 16:57:28
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 17:01:50
 */
import _ from 'lodash';
import fs from 'fs';

function readWorker() {
  const collections = [];
  const modelsDir = `${__dirname}/../worker`;
  if (fs.existsSync(modelsDir)) {
    const files = fs.readdirSync(modelsDir);
    _.each(files, (v) => {
      if (v.lastIndexOf('index.js') === -1) {
        const model = require(`${modelsDir}/${v}`);
        collections.push(model);
      }
    });
  }
  return collections;
}

const workerImp = readWorker();
module.exports = workerImp;
