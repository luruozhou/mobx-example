# mobx-example
the best practice for mobx

# 上手指南

## 概览

技术栈

- TypeScript (3.x)
- react 16.x
- mobx

快速运行

```bash
$ node -v
v8.1.2
$ npm install
$ npm start
```

打开浏览器访问 [http://localhost:8080](http://localhost:8080/)

### 目录结构

项目根目录为 `./src`（可在`package.json`内配置） 页面目录为 `pages`， 跨页面通用业务组件目录为 `components`。两个目录仅仅业务含义不同，但`store`和`action`的组织方式一致。


以 pages目录为例（components下的组件同理）
```text
    |--pages
      |--aPage
            |--index.tsx
            |--index.scss
            |--aComponet
                  |--index.tsx
                  |--index.scss
            |--actions
                  |--nameaAction.ts
                  |--namebAction.ts
            |--stores
                  |--nameaStore.ts
                  |--namebStore.ts
    |--components
        同pages结构
```

store或者action的所在页面名称和文件名称暗示了组件内获取对应实例的路径   
如 在组件文件`index.tsx`里，
```javascript
@inject(({rootStore, rootAction}) => {
    return {
        storeA: rootStore.aPage.nameaStore,
        actionA: rootAction.aPage.nameaAction
    }
})
```

实现上述功能的核心代码在`mobx`目录内。
* 1、mStore 和mAction装饰器收集需要注册的store和action的class
* 2、provider根据收集到的store和action按照页面划分结构，并注入到根组件中。
* 3、各级子组件通过 mobx-react提供的inject来获取需要的store和action
*  4、action和store按需实例化，action实例化时会传入当前页面的store和action，也可以通过第3、4个参数拿到rootStore 和rootAction
* 借助`zone.js`确保`store`的方法调用只能限制在`action`内

## 开发


### 脚手架

#### 添加前端页面或者组件

```sh
node tools/add-page.js [page-path] 
-m   创建mobx相关文件 xxStore,xxAction
-c   创建通用组件，所有文件会生成到components目录下，其他没区别
更多命令通过 node tools/add-page.js -h 查看
# 如
node tools/add-page.js home -m
node tools/add-page.js home/aComponent -m
```

#### 删除前端页面目录或者组件目录
```sh
node tools/rm-page.js [page-path] 
# 如
node tools/rm-page.js home
node tools/rm-page.js home/aComponent
```
以上两个命令除了生成或者删除对应文件，还会更新`mobxDependence.js`文件对所有store和action文件的引用.
如果是手动添加删除，需要手动去引入或删除对应store和action文件的引用。


#### 类型声明

在用脚手架创建或删除组件时，均会更新`typings/index.d.ts`,以便获得更好的代码提示。

#### ts transformer plugin
所在目录 `./transformer`

可以发现组件里`store`和`action`的装饰器并未显式的指定本身的访问路径(当然也可以手动指定)，这正是这个`ts`插件所发挥的作用，通过`store(action)`所在的目录和文件名暗示`store(action)`在`rootStore`(`rootAction`)的访问路径。



