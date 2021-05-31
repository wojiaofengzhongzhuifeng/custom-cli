#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const ejs = require('ejs')



// 模版文件目录
const destUrl = path.join(__dirname, 'templates');

// 生成文件目录
// process.cwd() 对应控制台所在目录
const cwdUrl = process.cwd();

console.log('cwdUrl', cwdUrl);

// 从模版目录中读取文件
fs.readdir(destUrl, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
        // 使用 ejs 渲染对应的模版文件
        // renderFile（模版文件地址，传入渲染数据）
        ejs.renderFile(path.join(destUrl, file), {name: 'fdfdfdfdf'}).then(data => {
            // 生成 ejs 处理后的模版文件
            fs.writeFileSync(path.join(cwdUrl, file), data)
        })
    })
})
