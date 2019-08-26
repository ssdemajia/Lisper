<template>
  <nav class="lisper-nav">
    <div class="icon" @click="goHome">
      <img src="../../assets/icons-bird.png" alt="lisper icon" />
      <div class="lisper-title">Lisper</div>
    </div>
    <div class="login">
      <router-link v-if="hasLogin" to="/console">
        <img class="avatar" :src="avatar" />
      </router-link>
      <a v-else @click="loginUrl">登陆</a>
    </div>
  </nav>
</template>

<script>
export default {
  created() {
    window.addEventListener("storage", this.afterLogin);
    this.$store.dispatch('getInfo');
  },
  destroyed() {
    window.removeEventListener("storage", this.afterLogin);
  },
  methods: {
    goHome() {
      if (window.location.pathname !== '/')
        this.$router.push('/');
    },
    loginUrl() {
      const client_id = "4738c00aa0a85c9b7f0e";
      const redirectURI = encodeURI(`http://127.0.0.1:9999/oauth`);
      const oAuthURL = `https://github.com/login/oauth/authorize?response_type=code&client_id=${client_id}&redirect_uri=${redirectURI}`;
      window.open(oAuthURL, "github登陆");
    },
    afterLogin(e) {
      if (e.key !== "oauth-code") return;
      const code = e.newValue.split("=")[1];
      this.$store
        .dispatch("login", code)
        .then(_ => {
          this.$router.push('/console')
        })
        .catch(_ => {
          this.$message("登陆失败");
        });
    }
  },
  computed: {
    hasLogin() {
      return this.$store.state.user.avatar_url.length != 0;
    },
    avatar() {
      return this.$store.state.user.avatar_url;
    }
  }
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Merienda:400,700&display=swap");

.lisper-nav {
  background: #014892;
  display: flex;
  justify-content: space-between;
  height: 80px;
  .icon {
    cursor: pointer;
    display: flex;
    img {
      margin: auto 8px auto 32px;
      height: 70px;
    }
    .lisper-title {
      font-family: "Merienda", cursive;
      font-weight: 700;
      font-size: 36px;
      vertical-align: middle;
      line-height: 80px;
      color: #ffffff;
    }
  }
  .login {
    vertical-align: middle;
    line-height: 80px;
    font-size: 18px;
    margin-right: 32px;
    a {
      cursor: pointer;
      text-decoration: none;
      color: #fff;
      &:hover {
        color: aqua;
      }
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 75%;
      border: 2px solid white;
      vertical-align: middle;
      transition: transform 0.5s ease;
      &:hover {
        transform: rotate(360deg);
      }
    }
  }
}
</style>