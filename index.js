#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise
const { program } = require('commander');
const inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();




// 模版文件目录
const destUrl = path.join(__dirname, 'templates');

// 生成文件目录
// process.cwd() 对应控制台所在目录
const cwdUrl = process.cwd();

console.log('cwdUrl', cwdUrl);

// // 从模版目录中读取文件
// fs.readdir(destUrl, (err, files) => {
//     if (err) throw err;
//
//     files.forEach((file) => {
//         // 使用 ejs 渲染对应的模版文件
//         // renderFile（模版文件地址，传入渲染数据）
//         ejs.renderFile(path.join(destUrl, file), {name: 'fdfdfdfdf'}).then(data => {
//             // 生成 ejs 处理后的模版文件
//             fs.writeFileSync(path.join(cwdUrl, file), data)
//         })
//     })
// })

// downloadGitRepo('github:wojiaofengzhongzhuifeng/bos-vanilla#main', cwdUrl, { clone: false }, function (err) {
//     console.log(err);
//     console.log(err ? 'Error' : 'Success')
// })

program
  .command('create [destination]')
  .description('创建一个模板代码')
  .action((destination) => {
    let des = path.join(cwdUrl, destination)
    prompt({
      name: 'selectBOS',
      type: 'checkbox',
      message: '选择想使用的 BOS 产品(可多选)',
      choices: [
        { name: 'BOS3D', value: 'BOS3D' },
        { name: 'BOSGEO', value: 'BOSGEO' },
      ],
    }).then((selectBOS)=>{
      prompt({
        name: 'frontEndFramework',
        type: 'list',
        message: '选择想使用的前端框架',
        choices: [
          { name: 'Vue', value: 'Vue' },
          { name: 'React', value: 'React' },
          { name: 'Vanilla', value: 'Vanilla' },
        ],
      }).then((select)=>{
        console.log(selectBOS);   // { selectBOS: [ 'BOS3D', 'BOSGEO' ] }
        if(select.frontEndFramework === 'React'){
          downloadGitRepo('github:wojiaofengzhongzhuifeng/bos-react#main', des, { clone: false }, function (err) {
            const publicDirPath = path.join(cwdUrl, './public');
            fs.readdir(publicDirPath, (err, files) => {
              if (err) throw err;
              files.forEach((file) => {
                if(file === 'index.html'){
                  ejs.renderFile(path.join(publicDirPath, file), getSelectBOS(selectBOS)).then(data => {
                    // 生成 ejs 处理后的模版文件
                    fs.writeFileSync(path.join(publicDirPath, file) , data)
                  })
                }
              })
            })
          })
        }
      });
    });

  });

program.parse();

// { selectBOS: [ 'BOS3D', 'BOSGEO' ] } => {'BOS3D': true, 'BOSGEO': true}
function getSelectBOS(data){
  let result = {};
  data.selectBOS.map((string)=>{
    result[string] = true
  });
  return result
}
