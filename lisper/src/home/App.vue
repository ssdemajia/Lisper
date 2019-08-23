<template>
  <main>
    <nav-header></nav-header>
    <router-view></router-view>
  </main>
</template>

<script>
import NavHeader from './views/NavHeader'
export default {
  components: {
    NavHeader
  }
};
</script>
<style lang="scss">
body {
  background: #eee;
  margin: 0px;
}
</style>
<style lang="scss" scoped>
main {
  margin: 0 auto;
  max-width: 960px;
  background: #fff;
}
</style>
