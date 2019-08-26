<template>
  <div class="console">
    <h2>Github ID: {{ githubId }}</h2>
    <h2 class="comment-header">评论管理</h2>
    <div v-for="comment in comments" :key="comment.id" class="comments">
      <div class="link">
        文章：
        <router-link :to="'console/edit?page=' + comment.page">{{ comment.page }}</router-link>
      </div>
      <div class="count">评论数：{{ comment['count(`page`)']}}</div>
    </div>
  </div>
</template>

<script>
export default {
  async created() {
    if (!this.$store.getters.isLogging) {
      this.$router.push("/");
      return;
    }
    await this.$store.dispatch("getComments", 0);
  },
  computed: {
    comments() {
      return this.$store.state.comment.comments;
    },
    githubId() {
      return this.$store.state.user.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.console {
  padding: 36px;
  .comment-header {
    border-bottom: 1px solid #eaecef;
  }
  .comments {
    height: 42px;
    padding-left: 0 18px;
    display: flex;
    justify-content: space-between;
  }
}
</style>