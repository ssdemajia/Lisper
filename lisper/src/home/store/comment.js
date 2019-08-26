const commentStore = {
  state: {
    comments: [],
    paginator: {
      index: 1,
      total:0,
      size: 10,
    }
  },
  mutations: {
    setComments(state, comments) {
      state.comments = comments;
    },
    setPaginator(state, paginator) {
      Object.assign(state.paginator, paginator);
    }
  },
  actions: {
    getComments(ctx, pageIndex) {
      fetch(`/api/comment?index=${pageIndex}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          ctx.commit('setComments', data.value.comments);
          ctx.commit('setPaginator', data.value.paginator);
        }
        return data.status;
      })
    }
  }
}

export default commentStore;
