const express = require('express');
const debug = require('debug')('Lisper:user');
const router = express.Router();
const axios = require('axios');
const User = require('../model/User').User
const Config = require('../config');

router.get('/oauth/login', (req, res) => {
  const user = req.session.user;
  if (!user) {
    debug('[/oauth/login]github login');
    const redirectURI = 'https://comment.dowob.cn/oauth';
    const oAuthURL = `https://github.com/login/oauth/authorize?response_type=code&client_id=${Config.client_id}&redirect_uri=${redirectURI}`;
    res.redirect(oAuthURL);
    return;
  }
  res.render('blank')
});

router.get('/oauth', (req, res) => {
  const code = req.query.code;
  debug(`[/oauth]code:${code}`)
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
    debug('[/oauth]accessToken:', accessToken);
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
      debug('[/oauth]create user:' + github_url);
      await User.create({
        id,
        github_url,
        avatar_url,
        name,
        blog_url
      });
      user = await User.find(id);
    }
    debug('[/oauth]github id:' + id);
    debug('[/oauth]session user:', user);
    req.session.user = user;
    res.render('blank')
  }).catch(() => {
    res.render('error')
  })
});

module.exports = router;