const MarkdownIt = require('markdown-it');
const hljs = require('highlight.js');
const { getOptions } = require('loader-utils');
const validateOptions  = require('schema-utils');
const fs = require('fs');

// 配置markdownit
const md = new MarkdownIt({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          // eslint-disable-next-line no-empty
          } catch (__) {}
        }
    
        return ''; // use external default escaping
      }
});

// 当前loader的参数
const schema = {
    type: 'object', 
    option: {
        stylePath: {
            type: 'strinngn'
        }
    }
}

module.exports = function(source, map) {
    this.cacheable(true);
    let callback = this.async();
    const options = getOptions(this);
    validateOptions(schema, options, 'md-loader');
    const stylePath = options.stylePath;
    this.addDependency(stylePath);

    const fileNameAndExt = stylePath.split('.'); // 设置样式类型，scss或者是css
    let styleType = 'scss';
    if (fileNameAndExt.length == 2) {
        styleType = fileNameAndExt[1];
    }

    let template = md.render(source)
    template = `<article id="markdown-article">${template}</article>`
    fs.readFile(stylePath, function(err, data) {
        if (err) return callback(err);
        let result = `
        <template>${template}</template>
        <style lang="${styleType}" scoped>${data}</style>
        `;
        callback(null, result, map);
    })
}