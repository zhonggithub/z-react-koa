/*
 * @Author: Zz
 * @Date: 2017-05-23 11:48:54
 * @Last Modified by:   Zz
 * @Last Modified time: 2017-05-23 11:48:54
 */
import Router from 'koa-router';
import fs from 'fs';

const router = new Router();

router.get('*', async (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(`${__dirname}/../public/index.html`);
});

export default (app) => {
  app
    .use(router.routes())
    .use(router.allowedMethods());
};
