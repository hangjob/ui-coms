# Vue如何解决组件兼容Vue2和Vue3?

> 为何需要解决此类问题，在于公司的项目业务需要，以及前端技术驱动向前推进 ，需要使用Vue3开发新的组件库，需要兼容Vue2的产品(公司现阶段Vue2产品为主)

# vue-demi

> Vue Demi（法语的一半）是一个开发实用程序，允许您为 Vue 2 和 3 编写通用 Vue 库，作者也是Vue开发核心人物之一

## 如何搭建一个Vue2/3的组件兼容库?

### 1.安装一个Vue3的项目

这里我选用的vite安装

```shell
npm create vite@latest pm-ui-coms --template vue
```

安装完成，进入目录`pm-ui-coms`

```shell
npm i vue-demi -S
```

修改`package.json`文件,文件以下内容

```json
{
    "publishConfig": {
        "registry": "http://192.168.1.200:8081/repository/npm-private/"
    }
}
```

##### publishConfig

> 发布使用的配置

### 2.安装一个Vue2的项目

```shell
vue create vue2
```

安装完成，进入目录`vue2`

```shell
npm i vue-demi -S
```

修改`package.json`文件,文件以下内容

```json
{
    "peerDependencies": {
        "@vue/composition-api": "^1.7.1",
        "vue": "^2.6.14 || >=3.2.47"
    },
    "peerDependenciesMeta": {
        "@vue/composition-api": {
            "optional": true
        }
    }
}
```

*在vue2以上操作完成后，如果失败，需要重新npm install*

##### 检验是否安装完成，执行此命令，如果显示一切换到Vue2，说明成功

```shell
npx vue-demi-switch 2
```

##### peerDependencies

没写过npm插件包的同学可能会有点陌生
> peerDependencies的目的是提示宿主环境去安装满足插件peerDependencies所指定依赖的包，然后在插件import或者require所依赖的包的时候，永远都是引用宿主环境统一安装的npm包，最终解决插件与所依赖包不一致的问题

##### peerDependenciesMeta

> 添加可选设置以消除丢失的对等依赖性警告

## 添加构建命令

```json
{
    "scripts": {
        "lib": "vite build --mode lib",
        "gulp": "gulp lib"
    }
}
```

```javascript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import pmVueLib2 from './plugins/pmVueLib2' // 我自己写的自动化构建+上传
import path from 'path'; // node插件，不用安装一般自带这个包

export default defineConfig({
    plugins: [vue(), pmVueLib2({versionType: 'patch'})],
    optimizeDeps: {
        exclude: ['vue-demi'] // vue-demi 如果是vite需要添加此配置
    },
    build: {
        outDir: 'lib', // 输出的目录
        lib: {
            entry: path.resolve(__dirname, './src/packages/install.js'), // 入口文件
            name: 'PmUiComps', // 在浏览器umd模式下输出的全局变量
            fileName: (format) => `v3.${format}.js`, // 由formats决定输出的文件后缀名
            formats: ['es', 'umd'], // 输出ES Module 和 umd
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: ['vue', 'vue-demi'],
            output: {
                // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
                globals: {
                    vue: 'Vue',
                    "vue-demi": 'VueDemi'
                }
            }
        }
    }
})

```

##### pmVueLib2插件

为了方便快速上传打包，写了一个vite插件

```javascript
const exec = require('child_process').exec; // 执行node命令，可以指定目录
const shell = require("shelljs");  // 执行文件操作
const chalk = require('chalk'); // 显示彩色文字
const ora = require('ora') // 命令行loading
const pmVueLib2 = (options) => {
    // patch minor major
    const _options = Object.assign({versionType: 'patch'}, options)
    console.log(chalk.green(`🚀   构建vue3库成功`))
    return {
        name: 'pmVueLib2', // 必须的，将会在 warning 和 error 中显示
        buildEnd() {
            const spinner = ora('🚀   开始构建vue2库...').start();
            exec('npm run lib', {cwd: './vue2'}, (err, stdout, stderr) => {
                if (err) {
                    console.warn(new Date(), '构建vue2库失败');
                } else {
                    spinner.color = 'green'
                    spinner.text = '构建vue2库成功'
                    console.log(chalk.green(`🚀   构建vue2库成功`))
                    exec('npm run gulp', {}, (err) => {
                        if (!err) {
                            shell.exec('git add .')
                            shell.exec(`git commit -m msg:自动更新组件库`)
                            shell.exec(`git push`)
                            exec(`npm version ${_options.versionType}`, {}, (err) => {
                                if (!err) {
                                    exec('npm publish', {}, () => {
                                        spinner.color = 'yellow'
                                        spinner.text = '构建完毕，组件库已成功上传npm仓库'
                                        console.log(chalk.green(`🚀   构建完毕，组件库已成功上传npm仓库`))
                                    })
                                } else {
                                    console.log(err)
                                }
                                spinner.stop();
                            })
                        }
                    })
                }
            });
        }
    }
}
export default pmVueLib2;
```

## 构建库
```shell
npm run lib
```

[github地址](https://github.com/hangjob/ui-coms)


# 使用此仓库开发
1.下载此项目代码, 在根目录执行
```shell
npm install 
```
2.进入`vue2目录`,然后执行
```shell
npm install
```
3.在根目录执行
```shell
npm run lib
```
