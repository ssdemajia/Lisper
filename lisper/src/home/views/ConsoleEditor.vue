<template>
  <article class="editor">
    <h3>文章：{{ $route.query.page }}</h3>
    <div class="comment" v-for="comment in comments" :key="comment.create_at">
      <div class="side">
        <div class="username">
          用户：
          <a :href="comment.github_url" target="_blank">{{ comment.name }}</a>
        </div>
        <div class="date">{{ formatDate(comment.create_at) }}</div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div>
        <button @click="handleDelete(comment)">删除</button>
      </div>
    </div>
    <el-dialog title="警告⚠️" :visible.sync="showDialog" width="20%">
      <span>是否确认删除此评论？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteComment">确定</el-button>
      </span>
    </el-dialog>
  </article>
</template>

<script>
export default {
  data() {
    return {
      currentComment: null,
      showDialog: false,
      comments: []
    };
  },
  created() {
    this.getComments();
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() +
        1}-${d.getDay()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    },
    handleDelete(comment) {
      this.currentComment = comment;
      this.showDialog = true;
    },
    deleteComment() {
      fetch(`/api/comment?id=${this.currentComment.id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(res => {
          if (res.status === 'success') {
            this.$message('删除成功');
          }
          this.getComments();
        })
      this.showDialog = false;
    },
    getComments() {
      const page = decodeURI(this.$route.query.page);
      fetch(`/api/comment?page=${page}&id=${this.$store.state.user.id}`)
        .then(res => res.json())
        .then(res => {
          this.comments = res.value;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.editor {
  padding: 24px;
}
.comment {
  display: grid;
  grid-template-columns: 150px auto 40px;
  margin: 8px 0;
  padding: 8px;
  min-height: 42px;
  border-top: 1px solid #eaecef;
  .side {
    .date {
      font-size: 12px;
      color: rgb(112, 112, 112);
      margin: 8px 0;
    }
  }

  button {
    display: block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #014892;
    border: 1px solid #dcdfe6;
    color: #fff;
    text-align: center;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    padding: 8px 4px;
    font-size: 12px;
    border-radius: 4px;
    width: 40px;
    &:active {
      background: #eee;
    }
  }
}
</style>