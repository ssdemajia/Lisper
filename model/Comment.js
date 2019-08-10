const db = require('./db');

class Comment {
  static find(page, page_user) {
    return db('comment')
      .join('user', { 'user.id': 'comment.comment_user' })
      .where({ page, page_user })
      .select('comment.id', 'name', 'create_at', 'content', 'github_url', 'avatar_url', 'blog_url')
  }
  static create(data) {
    return db('comment').insert(data);
  }
  static delete(id) {
    return db('comment').where({ id }).delete();
  }
  static findContent(page, content) {
    return db('comment').where({ page, content }).select('id');
  }
}
module.exports.Comment = Comment;