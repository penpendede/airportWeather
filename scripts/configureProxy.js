const fs = require('fs-extra')
const Mustache = require('mustache')
const config = require('../conf/proxy')

fs.readFile('./node_modules/guide4you-proxy/proxy.php', 'utf8', function (err, data) {
  if (!err) {
    fs.ensureFile('./proxy/proxy.php').then(function () {
      fs.writeFile('./proxy/proxy.php', Mustache.render(data, config))
    })
  }
})
