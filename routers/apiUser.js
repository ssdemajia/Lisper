const express = require('express');
const debug = require('debug')('Lisper:api:user');
const router = express.Router();
const axios = require('axios');
const User = require('../model/User').User

router.get('/', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.json({ status: 'success', value: user });
  } else {
    res.json({ status: 'login' });
  }
})

router.get('/login', (req, res) => {
  const code = req.query.code;
  debug(`[/oauth]code:${code}`)
  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token?' +
      `client_id=${process.env.CLIENT_ID}&` +
      `client_secret=${process.env.CLIENT_SECRET_ID}&` +
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
    res.json({ status: 'success', value: user });
  }).catch(err => {
    console.log(err);
    res.json({ status: 'error', value: err});
  })
});
module.exports = router;