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

const reactBOS3DCode = `import {useEffect} from 'react';
const BOS3DComponent = ()=>{

  useEffect(()=>{
    const option = {host: "https://bos3d.bimwinner.com", viewport: "viewport"};
    const viewer3D = new BOS3D.Viewer(option);
    viewer3D.addView("M1598257565598", "he3285593fdc4ea3b91784c5741ff8aa");
    viewer3D.registerModelEventListener(window.BOS3D.EVENTS.ON_LOAD_COMPLETE, function () {
      viewer3D.flyTo({"position":{"x":17516.55516689178,"y":55074.866969890405,"z":-148081.89444906908},"target":{"x":29581.341524520445,"y":16857.879928980838,"z":5829.884063979029},"up":{"x":0,"y":0,"z":1}})
    })
  }, [])

  return (
    <div style={{width: '100vw', height: '100vh', border: '1px solid red'}} id='viewport'></div>
  )
};
export default BOS3DComponent
`

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
            if(err){console.log('获取模板代码出错',);return}
            const publicDirPath = path.join(des, './public');
            const srcDirPath = path.join(des, './src');
            let computedSelectBOS = getSelectBOS(selectBOS);
            fs.readdir(publicDirPath, (err, files) => {
              if (err) throw err;
              // 加上用户所需的 bos 产品 url
              files.forEach((file) => {
                if(file === 'index.html'){
                  ejs.renderFile(path.join(publicDirPath, file), computedSelectBOS).then(data => {
                    fs.writeFileSync(path.join(publicDirPath, file) , data);
                    if(computedSelectBOS.BOS3D){
                      autoAddBOS3DCode(srcDirPath);
                    }
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

// 在指定位置添加代码
/*
*
*
insertStringToExample('/user/test/a.js', 'add demo 3', `<Route path="/${componentName}" exact component={${componentName}Demo} />`);
在 add demo 3 位置后面添加 <Route path="/${componentName}" exact component={${componentName}Demo} />
*
* */
function insertStringToExample(filePath, tagString, insertString, fn){
  // 写入 example
  fs.readFile(filePath, {
    encoding: 'utf-8'
  }, (err, data)=>{
    if(!err){
      const stringArray = data.split('\n');
      let searchIndex = getSearchIndex(stringArray, tagString);
      stringArray.splice(searchIndex + 1, 0, insertString);
      const exampleString = stringArray.join("\n");
      fs.writeFile(filePath, exampleString, (err)=>{
        console.log(err);
        fn && fn();
      })
    }
  });
}

function getSearchIndex(array, search){
  for(let i=0;i<=array.length - 1;i++){
    const item = array[i]
    if(item.includes(search)){
      return i;
      break
    }
  }
  return -1
}

// 如果用户选择了 BOS3D ,那么需要 ①添加 src/BOS3D.js 代码 ②在 src/App.js 中添加相应代码
function autoAddBOS3DCode(srcDirPath){
  // 添加产品组件文件到模板代码中
  fs.writeFileSync(path.join(srcDirPath, 'BOS3D.js'), reactBOS3DCode)
  insertStringToExample(
    path.join(srcDirPath, 'App.js'),
    'bos3d-dynamic-code-import',
    `import BOS3DComponent from './BOS3D';`,
    ()=>{
      insertStringToExample(
        path.join(srcDirPath, 'App.js'),
        'bos3d-dynamic-code-usage',
        `    <BOS3DComponent />`
      )
    }
  )
}
