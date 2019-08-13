const express = require('express');
const api = express.Router();
const apiUserRouter = require('./apiUser');
const apiCommentRouter = require('./apiComment');

api.use('/user', apiUserRouter);
api.use('/comment', apiCommentRouter);

module.exports = api;