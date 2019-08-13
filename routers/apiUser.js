const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const user = req.session.user;
  if (user) {
    res.json({ status: 'success', value: user });
  } else {
    res.json({ status: 'login' });
  }
})

module.exports = router;