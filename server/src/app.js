/**
* @Author: Zz
* @Date:   2016-09-27T20:03:49+08:00
* @Email:  quitjie@gmail.com
* @Last modified by:   Zz
* @Last modified time: 2016-10-01T22:56:34+08:00
*/
import Koa from 'koa';
import koaConvert from 'koa-convert';
import session from 'koa-session';
import koaBunyanLogger from 'koa-bunyan-logger';
import koaStaticCache from 'koa-static-cache';
import cors from 'koa-cors';
import invoke from 'uMicro-invoke';
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

app.use(cors());
app.keys = ['hms-group-console_session'];
app
  .use(koaConvert(session(app)))
  .use(koaConvert(koaStaticCache(`${__dirname}/public/`, {
    prefix: '/group/public/',
    maxAge: 100000000000,
  })))
  .use(handleError)
  .use(koaConvert(koaBunyanLogger({
    name: 'hms-group-console-web',
    level: (
      process.env.NODE_ENV === 'test'
        ? 'fatal'
        : process.env.LOG_LEVEL
    ),
  })))
  .use(koaConvert(koaBunyanLogger.requestIdContext()))
  .use(invoke)
  .use(koaConvert(koaBunyanLogger.requestLogger()));

app.proxy = true;
routes(app);

export default app;

if (!module.parent) {
  app.listen(process.env.PORT);
}
