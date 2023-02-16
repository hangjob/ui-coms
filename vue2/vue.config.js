const {defineConfig} = require('@vue/cli-service')
const path = require('path');//引入path模块

function resolve(dir) {
    return path.join(__dirname, dir)//path.join(__dirname)设置绝对路径
}

module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('__ROOT__', resolve(''))
    },
    css: {
        extract: true // 关闭内联
    }
})
