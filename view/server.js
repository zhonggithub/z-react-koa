/**
* @Author: Zz
* @Date:   2016-09-09 10:09:20
* @Email:  quitjie@gmail.com
* @Project: hms-group-web
* @Last modified by:   Zz
* @Last modified time: 2016-10-09T20:23:25+08:00
*/
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const fs = require('fs');
const webpackConfig = require('./webpack.config');
const bodyParser = require('body-parser');

const app = express();

const compiler = webpack(webpackConfig);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(webpackDevMiddleware(compiler, {
  publicPath : webpackConfig.output.publicPath,
  status: {
    colors: true
  }
}));
app.use(require('webpack-hot-middleware')(compiler));

function resFun(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json'
  });
  res.write(JSON.stringify(data));
  res.end();
}

app.post('/group/api/login', (req, res, next) => {
  const data = {
    code: 0,
    message: 'success',
    data: {
      token: 'token',
      user: {
        account: 'zz0',
        password: '',
        name: 'zz0',
        roles: [],
        lastLoginTime: 1473386516,
        id: '57de55213e442a17287ecd67',
        createAt: 1473326516,
        updateAt: 1473326516,
        tid: '12564'
      }
    },
   };
   resFun(res, data);
});

app.post('/group/api/logout', (req, res, next) => {
  const data = {
    code: 0,
    message: 'success',
    data: {
    },
   };
   resFun(res, data);
});

app.use('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(`${compiler.outputPath}index.html`,
  (err, rst) => {
    if(err){
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.end(rst);
  });
});

app.listen(3001, () => {
  console.log('listen 3001');
});
