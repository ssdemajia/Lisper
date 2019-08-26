const xss = require('xss');
const debug = require('debug')('Lisper:api:comment');
const express = require('express');
const Comment = require('../model/Comment').Comment;

const router = express.Router();

router.get('/', async (req, res) => {
  const id = req.query.id;
  const page = req.query.page;
  const index = req.query.index;
  if (id && page) {
    Comment.find(page, id).then(result => {
      res.json({ status: 'success', value: result });
    });
  } else if (index) {
    if (req.session.user) {
      let result = await Comment.findAll(req.session.user.id, index)
      let total = await Comment.count(req.session.user.id);
      res.json({ 
        status: 'success', 
        value: {
          comments: result,
          paginator: {
            total: total[0]
          }
        }
      });
      return;
    }
    res.json({ status: 'error', value: '请登陆'})
  } else {
    res.json({ status: 'error', value: '请求参数格式错误' });
  }
});

router.post('/', async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const comment = xss(req.body.comment);
  const page = req.body.page;
  const page_user = req.body.id;
  const content = await Comment.findContent(page, comment);
  debug('[/comments] find content:', content)
  if (content.length != 0) {
    res.json({ status: 'repeat' });
    return;
  }
  Comment.create({
    page_user,
    page,
    content: comment,
    comment_user: user.id,
  }).then(() => {
    res.json({ status: 'success' });
  });
});

router.delete('/', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const id = req.query.id;
  Comment.delete(id).then(result => {
    debug(result);
    res.json({ status: 'success'})
  })
});

module.exports = router;