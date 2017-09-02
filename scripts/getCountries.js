const fs = require('fs-extra')
const http = require('http')
const papaparse = require('papaparse')

const config = {
  'local': {
    'file': './data/countries.json'
  },
  'remote': {
    'host': 'ourairports.com',
    'path': '/data/countries.csv'
  }
}

let data = []

http.get(config.remote).on('response', response => {
  response.on('data', chunk => data.push(chunk))
  response.on('end', () => {
    let header, parsed
    [header, ...parsed] = papaparse.parse(data.join(''), config.parseOptions).data
    let selector = {}
    let i = 0
    for (let field of ['id', 'code', 'name', 'continent', 'wp', 'keywords']) {
      selector[field] = i++
    }
    data = []
    fs.ensureFile(config.local.file).then(() => {
      fs.writeFile(config.local.file, JSON.stringify(
        parsed.map(item => {
          let newItem = {}
          for (let key in selector) {
            newItem[key] = item[selector[key]]
          }
          return newItem
        })
      ), (err) => {
        if (err) {
          throw err
        }
        console.log('Wrote country file')
      })
    })
  })
})
