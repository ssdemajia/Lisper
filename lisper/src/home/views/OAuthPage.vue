<script>
export default {
  created() {
    const hash = window.location.search.slice(1)
    if (window.localStorage) {
      console.log(window.localStorage);
      window.localStorage.setItem('oauth-code', hash);
      window.close();
    }
  },
  render(h) {
    h();
  }
};
</script>