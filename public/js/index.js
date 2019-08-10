let login_href = document.querySelector('#login-href'); // 登陆的链接
let login_user = document.querySelector('.login-user');  // 登陆后用户头像
let input_button = document.querySelector('.input-button'); // 用于提交评论的按钮
let comment_container;
let comment_num = document.querySelector('.comment-num'); // 评论数
let input_textarea = document.querySelector('.input-textarea');
let tips = document.querySelector('.tips'); // 操作提示
let win, intervaler, config;

function Tips(el, timeout, message) {
  el.innerText = message;
  if (Tips.timer) return;
  Tips.timer = setTimeout(() => {
    el.innerText = '';
    Tips.timer = null;
  }, timeout);
}

function Request(url, method, data) {
  let xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.open(method, url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
      if (xhr.status != 200) return;
      if (xhr.readyState == 4) {
        resolve(xhr.response);
      }
    };
    xhr.onerror = err => {
      reject(err);
    };
    if (method === 'post') {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}
function setUser(user, el) {
  let avatar = el.querySelector('.avatar');
  avatar.src = user.avatar_url;
  let github_url = el.querySelector('.github-url');
  github_url.innerText = user.name;
  github_url.addEventListener('click', e => {
    e.preventDefault();
    window.open(github_url);
  });
}
function getUser() {
  return Request('/user', 'GET').then(result => {
    if ('login' === result.status) {
      return;
    }
    const user = result.value;
    setUser(user, login_user);
    login_href.style.display = 'none';
    login_user.style.display = 'block';
  });
}

function getComments() {
  const param = [`id=${config.id}`, `page=${config.page}`].join('&');
  return Request('/comments?'+param, 'get').then(res => {
    if (res.status === 'success') {
      comment_container.comments = res.value;
      comment_num.innerText = res.value.length;
    } 
  });
}

function intervalHandle() {
  if (!win || !win.closed) return;
  clearInterval(intervaler);
}

function notifyHeight() {
  window.parent.postMessage({ label: 'height', value: document.documentElement.offsetHeight }, '*');
}

function buildVue() {
  comment_container = new Vue({
    el: '#comments',
    data: {
      comments: []
    },
    methods: {
      formatDate(date) {
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDay()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
      }
    }
  });
}

window.addEventListener('message', async e => {
  if (typeof (e.data) === 'object') {
    if ('label' in e.data && e.data.label == 'config') {
      config = e.data.value;
      await getUser();
      await getComments();
      notifyHeight();
      return;
    }
  }
  if (typeof (e.data) === 'string') {
    if (e.data === 'done') { // github 登陆完成，收到done消息
      getUser();
    }
  }
});

window.addEventListener('load', e => {
  notifyHeight();
  buildVue();
});

login_href.addEventListener('click', _ => {
  win = window.open('/oauth/login');
  intervaler = setInterval(intervalHandle, 100);
});

input_button.addEventListener('click', e => {
  if (input_textarea.value.length == 0) {
    Tips(tips, 2000, '输入评论后再提交');
    return;
  }
  const data = {
    comment: input_textarea.value,
    page: config.page,
    id: config.id
  };
  Request('/comments', 'post', data).then(async res => {
    if (res.status == 'success') {
      await getComments();
      notifyHeight();
      Tips(tips, 1000, '评论成功');
      input_textarea.value = '';
    }
    if (res.status == 'login') {
      Tips(tips, 2000, '请登陆后再评论');
      return;
    }
    if (res.status == 'repeat') {
      Tips(tips, 2000, '评论内容重复');
      return;
    }
  });
});