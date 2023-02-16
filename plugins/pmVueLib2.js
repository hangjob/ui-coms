const exec = require('child_process').exec;
const shell = require("shelljs");  // 执行文件操作
const chalk = require('chalk');
const ora = require('ora')
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
