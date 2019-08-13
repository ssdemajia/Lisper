const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream')
const express = require('express');
const logger = require('morgan');
const Sentry = require('@sentry/node');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const buildRandStr = require('./utils').buildRandStr;
const bodyPaser = require('body-parser');

const apiRouter = require('./routers/api');
const userRouter = require('./routers/user');
const indexRouter = require('./routers/index');
const commentRouter = require('./routers/comment');

const app = express();
const secret_code = buildRandStr(16);

app.disable('x-powered-by');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// 使用bootstrap
app.use(
  '/css/bootstrap.css', express.static('node_modules/bootstrap/dist/css/bootstrap.min.css')
);
// 静态文件处理，服务器上使用nginx
app.use(express.static('public'))
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }));
// session以及cookie
app.use(cookieParser(secret_code));
app.use(session({
  secret: secret_code,
  resave: false,
  saveUninitialized: true,
}));
// 触发页面内部测试条件
app.use((req, res, next) => {
  res.locals.shouldTest = app.get('env') !== 'production' && req.query.test === '1'
  next();
});
// 路由
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/user', userRouter);
app.use('/comment', commentRouter);

if (process.env.NODE_ENV === 'production') {
  // Sentry注册
  Sentry.init({ dsn: 'https://039fd40ec696417186340fdcd5a2a1c3@sentry.io/1528928' });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  // 日志
  const logDirectory = path.join(__dirname, 'log')
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
  var accessLogStream = rfs('access.log', {
    interval: '7d',
    path: logDirectory
  })
  app.use(logger('combined', { stream: accessLogStream }))
} else {
  // 开发日志
  app.use(logger('dev'));
}

app.listen(5000);

module.exports = app; // 用于nodemon