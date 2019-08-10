const knex = require('knex');

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'shaoshuai',
    password : 'Shaoshuai1105',
    database : 'dowob'
  }
});
module.exports = db;
