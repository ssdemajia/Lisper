# Lisper
Lisper是一个静态博客hexo的评论插件，访问https://dowob.cn 查看示例。

## hexo插件安装
适合没有服务器，博客部署在github page上的童鞋，使用我的服务器作为后端。
1. 在hexo模版中插入下面的代码
```html
#comments
  script(type='text/javascript').
    window.commentConfig = {
      page: '#{page.path}',
      id: #{theme.lisper},
      el: document.getElementById('comments')
    };
    (function() {
      var commentScript = document.createElement('script');
      commentScript.type = 'text/javascript';
      commentScript.async = true;
      commentScript.src = 'https://comment.dowob.cn/js/comment.js';
      (document.getElementsByTagName('head')[0]||document.getElementsByName('body')[0]).appendChild(commentScript);
    })();
```

2. 在hexo模版的配置文件(_config.yml)中添加：

```javascript
lisper: 11012329
```

   这个数字是github 用户id，需要登陆https://comment.dowob.cn 获取。

## 完整安装

适合有自己服务器的童鞋。
1. 在服务器中安装mysql，同时创建dowob这个表。
2. 在`model/db.js`中填写数据库账号密码，执行`node modal/createTable.js`来创建表。
3. 在https://github.com/settings/developers 里申请一个OAuth apps，将client_id和client_secret_id填入`config.js`中，填写主页和callback地址，callback地址是`https://主页/oauth`。
4. 配置https以及nginx https支持，因为github page使用https，如果要在里面插入iframe必须要是https。
5. `git clone https://github.com/ssdemajia/Lisper.git`
6. `npm install`
7. 使用forever来运行index.js. `npm install -g forever`
8. 将上面的插件加载代码插入，将里面的地址`commentScript.src = 'https://comment.dowob.cn/js/comment.js';` 改为你的服务器地址。
9. done

## 遇到问题

提issue或者邮件联系2chashao@gmail.com

## Todo

下面是准备开发的功能

- [ ] 界面主题
- [ ] 评论后台页面
- [ ] 评论插件使用webpack和vue重构
- [ ] 支持微信登陆
- [ ] 支持qq登陆

# 