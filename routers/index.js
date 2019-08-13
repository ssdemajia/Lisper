const debug = require('debug')('Lisper:index');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  debug(req.accepts())
  res.render('comment_index', {
    pageTestScript: '/qa/test-comment-index.js'
  });
});

module.exports = router;