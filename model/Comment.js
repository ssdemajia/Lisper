const db = require('./db');

class Comment {
  static find(page, page_user) {
    return db('comment')
      .join('user', { 'user.id': 'comment.comment_user' })
      .where({ page, page_user })
      .select('comment.id', 'name', 'create_at', 'content', 'github_url', 'avatar_url', 'blog_url')
  }
  static findAll(page_user, pageIndex=0, pageSize=10) {
    return db('comment')
      .where({ page_user })
      .groupBy('page')
      .offset(pageIndex*pageSize)
      .limit(pageSize)
      .count('page')
      .select('page');
  }
  static count(page_user) {
    return db('comment')
      .count({ page_user })
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
exports.Comment = Comment;