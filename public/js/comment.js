let iframe = document.createElement('iframe');
iframe.frameBorder = 0;
iframe.style.width = '100%';
iframe.scrolling = 'no';
iframe.src = 'http://localhost:5000/comments'
const config = window.commentConfig;
config.el.appendChild(iframe);

let iframe_config = {
  id: config.id,
  page: config.page
};
iframe.addEventListener('load', _ => {  // 当iframe就绪后发送config给他
  iframe.contentWindow.postMessage({ label: 'config', value: iframe_config }, '*');
})

window.addEventListener('message', e => { // 延伸iframe的高度，高度由子iframe发送
  if (typeof(e.data) === 'object' && 'label' in e.data) {
    iframe.style.height = e.data.value + 'px';
  }
})