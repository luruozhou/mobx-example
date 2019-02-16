/// <reference path="../typings/node/node.d.ts"/>

let program = require("commander");
let FS = require('fs-extra');
let Path = require('path');
let ChildProcess = require('child_process');
let Chalk = require('chalk');

let packageJson = FS.readJSONSync(Path.join(process.cwd(),'package.json'),{encoding:"utf-8"});
let basePath =packageJson.basePath;

if(!basePath){
  console.log(`you should set the key ${Chalk.red("basePath")} in your ${Chalk.green("package.json")} file. For example, ${Chalk.red('"basePath":"./src"')}`)
  return;
}

program
  .version("0.0.1")
  .option('[<path>]  ', 'the path of page or component')
  .option('-m, --mobx', 'create store and action')
  .option('-c, --component', `will create files to ${Chalk.greenBright(Path.join(basePath, 'components'))} directory`)

program.on('--help', function () {
  console.log("  This is a quick tool to create a page.  \n  It can create index.tsx,index.scss file and add <-m> or <--mobx> param can create stores and actions \n");
  console.log('');

  console.log('  Examples:');

  console.log('');

  console.log(`    $ node tools/add-page.js offerList        ${Chalk.grey('// create a page')}`);

  console.log(`    $ node tools/add-page.js offerList -c        ${Chalk.grey('// create a component for common')}`);

  console.log(`    $ node tools/add-page.js offerList/tableList        ${Chalk.grey('// create a component inner page offerList')}`);

  console.log(`    $ node tools/add-page.js offerList -m        ${Chalk.grey('// create a page with stores and actions')}`);

  console.log('');
});

program.parse(process.argv);

if (program.args.length < 1)
  throw new Error("missing param");

let pageOrComPath = program.args[0];

//跨页面级通用组件独自一个目录
if (program.component) {
  basePath = Path.join(basePath, 'components')
} else {
  basePath = Path.join(basePath, 'pages')
}

let componentTpl = FS.readFileSync(__dirname + '/templates/index.tsx.tpl', 'utf-8');
let scssTpl = FS.readFileSync(__dirname + '/templates/index.scss.tpl', 'utf-8');

let splitPath = pageOrComPath.split('/').filter(Boolean);
let rootPageName = splitPath[0]; //页面目录
let fileDirectoryName = splitPath[splitPath.length - 1]; //页面内最深层目录

let pagePath = Path.join(process.cwd(), basePath, pageOrComPath)
let rootPagePath = Path.join(process.cwd(), basePath, rootPageName)


let pageTplData = {
  rootPageName,
  uppercaseName: fisrtToUppercase(fileDirectoryName),
  lowercaseName: fisrtToLowercase(fileDirectoryName),
  splitDashName: toSplitDash(pageOrComPath),
  relDir:new Array(splitPath.length+2).join('../'),
  type: program.component ? "component" : "page"
};

componentTpl = replaceVarible(componentTpl)

scssTpl = replaceVarible(scssTpl)


createFile(pagePath + "/index.tsx", componentTpl);
createFile(pagePath + "/index.scss", scssTpl);

if (program.mobx) {
  let storeTpl = FS.readFileSync(__dirname + '/templates/stores/store.ts.tpl', 'utf-8');
  let actionTpl = FS.readFileSync(__dirname + '/templates/actions/action.ts.tpl', 'utf-8');

  storeTpl = replaceVarible(storeTpl)
  actionTpl = replaceVarible(actionTpl)

  let storeName = rootPagePath + `/stores/${fisrtToLowercase(fileDirectoryName)}Store.ts`
  let actionName = rootPagePath + `/actions/${fisrtToLowercase(fileDirectoryName)}Action.ts`
  createFile(storeName, storeTpl);
  createFile(actionName, actionTpl);

  ChildProcess.execFile('node', [Path.join(__dirname, './sync-mobx.js')], function (error, stdout, stderr) {
    if (error) {
      console.error('stderr', stderr);
      throw  error;
    }
    console.log(Chalk.cyan(stdout))
  })
}


/**
 * 创建文件
 * @param path {string}     路径
 * @defaultFileContent ?{string}    默认文件内容
 * @return {bollean}
 */
function createFile(path, defaultFileContent) {
  defaultFileContent = defaultFileContent || "";
  if (FS.existsSync(path)) {
    console.log(Chalk.red('file already exists: ') + path);
    return false;
  } else {
    FS.outputFileSync(path, defaultFileContent);
    console.log('created "' + path + '".');
    return true;
  }
}

//替换模板变量
function replaceVarible(tpl) {
  return tpl.replace(/\$\{(\w+?)\}\$/g, function (m, letiable) {
    return pageTplData[letiable];
  })
}

function toSplitDash(str) {
  let upperCaseRegex = /[A-Z]+(?=[A-Z][a-z]|$)|[A-Z]/g;
  str = str.split('/').filter(Boolean).join('/')
  str = str.replace(/\//g, (m, index) => {
    return (index ? '__' : '');
  })
  return str.replace(upperCaseRegex, (m, index) => {
    return (index ? '-' : '') + m.toLowerCase();
  })
}

function fisrtToLowercase(str) {
  return str.charAt(0).toLowerCase() + str.substr(1)
}

function fisrtToUppercase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}
