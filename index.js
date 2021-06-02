#! /usr/bin/env node

const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise
const { program } = require('commander');
const inquirer = require('inquirer');
var prompt = inquirer.createPromptModule();
// 公司产品
const BOS_PRODUCT_LIST = [
  { name: 'BOS3D', value: 'BOS3D' },
  { name: 'BOSGEO', value: 'BOSGEO' },
]

// 生成文件目录
// 执行yjhl create 命令的路径
const cwdUrl = process.cwd();

program
  .command('create [destination]')
  .description('创建一个模板代码')
  .action((destination) => {
    let des = path.join(cwdUrl, destination)
    console.log('des', des);
    prompt({
      name: 'selectBOS',
      type: 'checkbox',
      message: '选择想使用的 BOS 产品(可多选)',
      choices: BOS_PRODUCT_LIST,
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
        if(select.frontEndFramework === 'React'){
          downloadGitRepo('github:wojiaofengzhongzhuifeng/bos-react#main', des, { clone: false }, function (err) {
            if(err){console.log('err', err)}
            const publicDirPath = path.join(des, './public');
            console.log('publicDirPath', publicDirPath);
            fs.readdir(publicDirPath, (err, files) => {
              if (err) throw err;
              files.forEach((file) => {
                if(file === 'index.html'){
                  ejs.renderFile(path.join(publicDirPath, file), getSelectBOS(selectBOS)).then(data => {
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

// { selectBOS: [ 'BOS3D' ] } + BOS_PRODUCT_LIST => {'BOS3D': true, 'BOSGEO': false}
function getSelectBOS(data){
  // {'BOS3D': false, 'BOSGEO': false}
  let allProductObj = BOS_PRODUCT_LIST.reduce((pre, next)=>{
    pre[next.name] = false
    return pre
  }, {});

  let result = {};
  data.selectBOS.map((string)=>{
    if(Object.keys(allProductObj).includes(string)){
      allProductObj[string] = true
    }
    result[string] = true
  });
  return allProductObj
}
