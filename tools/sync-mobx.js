let FS = require('fs-extra')
let Path = require('path')
let Chalk = require('chalk')
let listFile = require('./utils/io').listFiles

let packageJson = FS.readJSONSync(Path.join(process.cwd(), 'package.json'), {
  encoding: "utf-8"
});
let basePath = packageJson.basePath;
const storesPath = listFile(basePath, /(.+\/)*(stores|globalStores)\/(.+)\.(t|j)s$/g)
//所有store的path 数组
const actionsPath = listFile(basePath, /(.+\/)*actions\/(.+)\.(t|j)s$/g)
//所有action的path 数组
const mobxDependencePath = Path.join(process.cwd(), basePath); // ./src
const mobxTypingsPath = Path.join(process.cwd(), basePath, 'typings'); // ./src/typings


createDependenceFile()
createTypingsFile()

function createDependenceFile() {
  let content = createDependenceImportContent(mobxDependencePath)

  createFile(Path.join(mobxDependencePath, 'mobxDependence.ts'), content);
}

function createTypingsFile() {
  let importContent = createTypingsImportContent(mobxTypingsPath);
  let IRootStoreContent = generatorIRootStore();
  let IRootActionContent = generatorIRootAction();
  let IInjectContent =
    'export interface IInject {\n' +
    '    rootStore:IRootStore\n' +
    '    rootAction:IRootAction\n' +
    '}'

    let mobxReactModuleDeclare =
       'declare module "mobx-react" {' + '\n' +
       '   export type IValueMapSelf = IStoresToProps<IInject>;' + '\n\n' +
       '   export function inject<S extends IInject, P, I, C>(' + '\n' +
       '    fn: IStoresToProps<S, P, I, C>' + '\n' +
       '  ): <T extends IReactComponent>(target: T) => T & IWrappedComponent<P>' + '\n' +
       '}'

  let content =
    importContent + '\n\n' +
    IRootStoreContent + '\n\n' +
    IRootActionContent + '\n\n' +
    IInjectContent + '\n\n' +
    mobxReactModuleDeclare

  createFile(Path.join(mobxTypingsPath, 'index.d.ts'), content);
}

function generatorIRootStore() {
  let pathMap = storesPath.reduce((ret, path) => {
    let pathArr = getFileNameFrom(path);
    ret[pathArr[0]] = ret[pathArr[0]] || [];
    ret[pathArr[0]].push(pathArr[1]);
    return ret;
  }, {});
  let content =
    'export interface IRootStore {\n';
  content += Object.keys(pathMap).reduce((ret, pageName) => {
    ret += '  ' + pageName + ": {\n";
    let storeArr = pathMap[pageName];
    storeArr.forEach(storeName => {
      ret += '    ' + storeName + ":" + firstToUppercase(storeName) + '\n';
    })
    ret += "  }\n"
    return ret;
  }, '');

  content += '}';
  return content;
}

function generatorIRootAction() {
  let pathMap = actionsPath.reduce((ret, path) => {
    let pathArr = getFileNameFrom(path);
    ret[pathArr[0]] = ret[pathArr[0]] || [];
    ret[pathArr[0]].push(pathArr[1]);
    return ret;
  }, {});
  let content =
    'export interface IRootAction {\n';
  content += Object.keys(pathMap).reduce((ret, pageName) => {
    ret += '  ' + pageName + ": {\n";
    let actionArr = pathMap[pageName];
    actionArr.forEach(actionName => {
      ret += '    ' + actionName + ":" + firstToUppercase(actionName) + '\n';
    })
    ret += "  }\n"
    return ret;
  }, '');

  content += '}';
  return content;
}

function createDependenceImportContent(base) {
  let content = storesPath.concat(actionsPath).reduce((content, path) => {
    let pathArr = getFileNameFrom(path);
    let relativePath = Path.relative(base, path);
    if (relativePath.indexOf('.') !== 0) {
      relativePath = './' + relativePath
    }
    relativePath = removeExt(relativePath);
    let importConent = `import '${relativePath}'`

    content += importConent;
    content += '\n';
    return content;
  }, "")
  return content;
}

function createTypingsImportContent(base) {
  let content = storesPath.concat(actionsPath).reduce((content, path) => {
    let pathArr = getFileNameFrom(path);
    let relativePath = Path.relative(base, path);
    if (relativePath.indexOf('.') !== 0) {
      relativePath = './' + relativePath
    }
    relativePath = removeExt(relativePath);
    let importConent = `import ${firstToUppercase(pathArr[1])} from '${relativePath}'`

    content += importConent;
    content += '\n';
    return content;
  }, "")
  content += `import {IStoresToProps, IReactComponent, IWrappedComponent} from "mobx-react"
  `
  return content;
}


function getFileNameFrom(path) {
  let reg = /([^\/]+)\/(?:actions|stores|globalStores)\/(.+)\.(?:t|j)sx?$/
  let matched = path.match(reg)
  let pageName = matched && matched[1]
  let fileName = matched && matched[2]
  if (path.indexOf('globalStores') > -1) pageName = 'globalStores'
  return [pageName, fileName]
}

function firstToUppercase(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}

function removeExt(path){
  let reg = /(.+)\.[^\.]+$/;
  return path.replace(reg,'$1')
}


/**
 * 创建文件
 * @param path {string}     路径
 * @defaultFileContent ?{string}    默认文件内容
 * @return {bollean}
 */

function createFile(path, defaultFileContent) {
  defaultFileContent = defaultFileContent || ''
  let existed = FS.existsSync(path)
  FS.outputFileSync(path, defaultFileContent)
  if (existed) {
    console.log(Chalk.blue('updated "' + path + '".'))
  } else {
    console.log(Chalk.blue('created "' + path + '".'))
  }
  return true
}
