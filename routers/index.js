const debug = require('debug')('Lisper:index');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.redirect('http://127.0.0.1:9999/');
});

module.exports = router;