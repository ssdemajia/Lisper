const express = require('express');
const debug = require('debug')('Lisper:user');
const router = express.Router();

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


module.exports = router;