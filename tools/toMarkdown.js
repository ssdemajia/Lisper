const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const fs = require("fs");
if (process.argv.length != 3) {
  console.log("需要加入一个文件名");
  process.exit(0);
}
const file = process.argv[2];
fs.readFile(file, (err, data) => {
  if (err) console.log(err.message);
  console.log(md.render(data.toString('utf-8')))
});