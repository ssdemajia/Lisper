const db = require('./db');

class User {
  static all() {
    return db('user');
  }
  static find(id) {
    return db('user').where({ id }).first();
  }
  static create(data) {
    return db('user').insert(data);
  }
  static exist(github_id) {
    return db('user').where('github_id', github_id).limit(1);
  }
}
module.exports.User = User;