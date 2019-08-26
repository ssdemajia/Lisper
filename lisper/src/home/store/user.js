const userStore = {
  state: {
    name: '',
    id: 0,
    github_url: '',
    avatar_url: '',
    blog_url: '',
  },
  mutations: {
    setUser(state, user) {
      state.name = user.name;
      state.id = user.id;
      state.github_url = user.github_url;
      state.avatar_url = user.avatar_url;
      this.blog_url = user.blog_url;
    }
  },
  actions: {
    login(ctx, code) {
      return fetch(`/api/user/login?code=${code}`)
        .then(data => {
          return data.json()
        })
        .then(data => {
          if (data.status === 'success') {
            const user = data.value;
            ctx.commit('setUser', user);
          }
        })
    },
    getInfo(ctx) {
      return fetch(`/api/user/`)
        .then(data => data.json())
        .then(data => {
          if (data.status === 'success') {
            ctx.commit('setUser', data.value);
          }
          return data.status;
        })
    }
  },
  getters: {
    isLogging(state) {
      return state.id !== 0;
    }
  }
};

export default userStore;
