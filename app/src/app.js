/*
 * @Author: Zz
 * @Date: 2017-01-02 16:22:01
 * @Last Modified by: Zz
 * @Last Modified time: 2017-05-23 11:30:37
 */
import Koa from 'koa';
import koaConvert from 'koa-convert';
import koaBunyanLogger from 'koa-bunyan-logger';
import koaStaticCache from 'koa-static-cache';
import cors from 'koa2-cors';
import session from 'koa-session2';
import { RedisStore } from './common';
import './env';
import routes from './routes';

const app = new Koa();

const handleError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { message: err.message, code: err.code || ctx.status };
  }
};

const successHandler = async (ctx, next) => {
  await next();
  if (ctx.type !== 'text/html') {
    ctx.response.set('X-Server-Request-Id', ctx.reqId);
    if (!ctx.status || (ctx.status >= 200 && ctx.status < 400)) {
      // await writeLog(ctx, null);
      if (ctx.formatBody !== false) {
        ctx.body = {
          code: 0,
          message: 'success',
          data: ctx.body,
        };
      }
    }
  }
};

app.use(session({ store: new RedisStore() }));
app.use(cors())
  .use(koaConvert(koaStaticCache(`${__dirname}/public/`, {
    prefix: process.env.APP_PREFIX,
    maxAge: 100000000000,
  })))
  .use(successHandler)
  .use(handleError)
  .use(koaConvert(koaBunyanLogger({
    name: process.env.APP_NAME,
    level: (
      process.env.NODE_ENV === 'test'
        ? 'fatal'
        : process.env.LOG_LEVEL
    ),
  })))
  .use(koaConvert(koaBunyanLogger.requestIdContext()))
  .use(koaConvert(koaBunyanLogger.requestLogger()));

app.proxy = true;
routes(app);

export default app;

if (!module.parent) {
  app.listen(process.env.PORT);
}
