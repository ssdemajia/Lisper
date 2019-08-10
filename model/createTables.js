const db = require('./db');

const userP = db.schema.hasTable('user').then(exist => {
  if (!exist) {
    db.schema.createTable('user', table => {
      table.integer('id').unsigned().primary();
      table.string('github_url', 128);
      table.string('avatar_url', 128);
      table.string('blog_url', 128);
      table.string('name', 128);
    }).then()
  }
})
const commentP = db.schema.hasTable('comment').then(exist => {
  if (!exist) {
    db.schema.createTable('comment', table => {
      table.increments('id').primary();
      table.integer('page_user').unsigned().references('id').inTable('user');
      table.integer('comment_user').unsigned().references('id').inTable('user');
      table.timestamp('create_at').defaultTo(db.fn.now());
      table.string('page', 128);
      table.text('content');
      table.index(['page', 'page_user']);
    }).then();
  }
});

Promise.all([userP, commentP]).finally(_ => {
  console.log('finish')
  db.destroy();
});