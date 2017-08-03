let fs = require('fs-extra')
let http = require('http')
let papaparse = require('papaparse')

let config = {
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
    for (let field of ['code', 'name', 'continent']) {
      selector[field] = header.indexOf(field)
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
