const fs = require('fs-extra')
const copyTasks = require('../conf/copyTasks')

fs.removeSync('./website')
fs.mkdirSync('./website')
fs.mkdirSync('./website/css')
fs.mkdirSync('./website/js')

for (let src in copyTasks) {
  fs.copy(src, './website/' + copyTasks[src], {
    overwrite: true
  })
}
