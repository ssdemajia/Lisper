const xss = require('xss');
const debug = require('debug')('Lisper:api:comment');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const id = req.query.id;
  const page = req.query.page;
  Comment.find(page, id).then(result => {
    res.json({ status: 'success', value: result });
  });
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

router.delete('/:id', (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.send({ status: 'login' });
    return;
  }
  const id = req.query.id;
  Comment.delete(id).then(res => {
    debug(res);
  })
});

module.exports = router;