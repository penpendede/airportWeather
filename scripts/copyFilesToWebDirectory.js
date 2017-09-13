const fs = require('fs-extra')
const copyTasks = require('../conf/copyTasks')

fs.removeSync('./website')

for (let src in copyTasks) {
  fs.copy(src, copyTasks[src])
}
