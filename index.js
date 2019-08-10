const express = require('express');
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
  const dowob_id = req.signedCookies.dowob_id;
  if (!dowob_id) {
    const redirectURI = 'http://localhost:5000/oauth';
    const oAuthURL = `https://github.com/login/oauth/authorize?response_type=code&client_id=${Config.client_id}&redirect_uri=${redirectURI}`;
    res.redirect(oAuthURL);
    return;
  }
});

app.get('/oauth', (req, res) => {
  const code = req.query.code;
  console.log(`code:${code}`)
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
    console.log('accessToken:', accessToken);
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
    const user = await User.find(id);
    if (!user) {
      User.create({
        id,
        github_url,
        avatar_url,
        name,
        blog_url
      }).then(v => {
        console.log(v);
      })
    }
    console.log('github_id:', id);
    req.session.user = user;
    res.render('blank.ejs')
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

app.post('/comments', (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const comment = req.body.comment;
  const page = req.body.page;
  const page_user = req.body.id;
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
})
app.listen(5000, () => {
  console.log('app on http://localhost:5000')
})

module.exports = app; // 用于nodemon