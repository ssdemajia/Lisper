const express = require('express');
const Sentry = require('@sentry/node');
const xss = require('xss');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const session = require('express-session');
const buildRandStr = require('./utils').buildRandStr;
const bodyPaser = require('body-parser');
const Comment = require('./model/Comment').Comment;
const User = require('./model/User').User
const Config = require('./config');

const app = express();
const secret_code = buildRandStr(16);

app.set('port', process.env.PORT || 3000);

Sentry.init({ dsn: 'https://fdd0a15707d44b0d8115350b5825e1d7@sentry.io/1528919'});
app.use(Sentry.Handlers.requestHandler());

app.use(express.static('public'))
app.use(bodyPaser.json())
app.use(bodyPaser.urlencoded({ extended: true }));
app.use(cookieParser(secret_code));
app.use(session({
  secret: secret_code,
  resave: false,
  saveUninitialized: true,
}))

app.get('/oauth/login', (req, res) => {
  const user = req.session.user;
  if (!user) {
    console.log('[/oauth/login]github login');
    const redirectURI = 'https://comment.dowob.cn/oauth';
    const oAuthURL = `https://github.com/login/oauth/authorize?response_type=code&client_id=${Config.client_id}&redirect_uri=${redirectURI}`;
    res.redirect(oAuthURL);
    return;
  }
  res.render('blank.ejs')
});

app.get('/oauth', (req, res) => {
  const code = req.query.code;
  console.log(`[/oauth]code:${code}`)
  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?' +
      `client_id=${Config.client_id}&` +
      `client_secret=${Config.client_secret_id}&` +
      `code=${code}`,
    headers: {
      accept: 'application/json'
    }
  }).then(result => {
    const accessToken = result.data.access_token;
    console.log('[/oauth]accessToken:', accessToken);
    return axios({
      method: 'get',
      url: 'https://api.github.com/user',
      headers: {
        accept: 'application/json',
        Authorization: `token ${accessToken}`
      }
    });
  }).then(async result => {
    const id = result.data.id;
    const name = result.data.name;
    const github_url = result.data.html_url;
    const blog_url = result.data.blog;
    const avatar_url = result.data.avatar_url;
    let user = await User.find(id);
    if (!user) {
      console.log('[/oauth]create user:' + github_url);
      await User.create({
        id,
        github_url,
        avatar_url,
        name,
        blog_url
      });
      user = await User.find(id);
    }
    console.log('[/oauth]github id:' + id);
    console.log('[/oauth]session user:', user);
    req.session.user = user;
    res.render('blank.ejs')
  }).catch(err => {
    res.render('error.ejs')
  })
});

app.get('/comments', (req, res, next) => {
  res.format({
    json: () => {
      const id = req.query.id;
      const page = req.query.page;
      Comment.find(page, id).then(result => {
        res.send({ status: 'success', value: result });
      })
    },
    html: () => {
      res.render('index.ejs')
    }
  })
})

app.get('/user', (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.send({ status: 'success', value: user });
  } else {
    res.send({ status: 'login' });
  }
})

app.post('/comments', async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const comment = xss(req.body.comment);
  const page = req.body.page;
  const page_user = req.body.id;
  const content = await Comment.findContent(page, comment);
  console.log('[/comments] find content:', content)
  if (content.length != 0) {
    res.send({ status: 'repeat'});
    return;
  }
  Comment.create({
    page_user,
    page,
    content: comment,
    comment_user: user.id,
  }).then(r => {
    res.send({ status: 'success' });
  });
});

app.delete('/comments', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const id = req.query.id;
  Comment.delete(id).then(res => {
    console.log(res);
  })
});

app.get('/debug-sentry', (req, res) => {
  throw new Error('My first Sentry error');
});

app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    return error.status === 404 || error.status === 500;
  }
}));

app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(5000, () => {
  console.log('app started')
})

module.exports = app; // 用于nodemon