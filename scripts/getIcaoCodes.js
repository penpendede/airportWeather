let JSFtp = require('jsftp')
let fs = require('fs-extra')

let config = {
  'local': {
    'file': './data/icao.json'
  },
  'remote': {
    'host': 'tgftp.nws.noaa.gov',
    'path': '/data/observations/metar/stations'
  }
}

let ftp = new JSFtp({
  'host': config.remote.host
})

ftp.ls(config.remote.path, (err, res) => {
  ftp.raw('quit')
  if (err) {
    throw err
  }
  let iataCodes =
    res.map(entry => entry.name) // only file names
      .filter(fileName => fileName.match(/^[A-Z][A-Z0-9]{3}\.TXT$/)) // that have the right form
      .map(fileName => fileName.substring(0, 4)) // only use the ICAO code part
  if (iataCodes && Array.isArray(iataCodes) && iataCodes.length) {
    fs.ensureFile(config.local.file).then(() => {
      fs.writeFile(config.local.file, JSON.stringify(iataCodes), (err) => {
        if (err) {
          throw err
        }
        console.log('Wrote ICAO codes file')
      })
    })
  }
})
