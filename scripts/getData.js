let JSFtp = require('jsftp')
let fs = require('fs-extra')

let config = {
  'file': './data/icao.json',
  'host': 'tgftp.nws.noaa.gov',
  'path': '/data/observations/metar/stations'
}

let ftp = new JSFtp({
  'host': config.host
})

ftp.ls(config.path, (err, res) => {
  ftp.raw('quit')
  if (err) {
    throw err
  }
  let iataCodes =
    res.map(entry => entry.name) // only file names
      .filter(fileName => fileName.match(/^[A-Z][A-Z0-9]{3}\.TXT$/)) // that have the right form
      .map(fileName => fileName.substring(0, 4)) // only use the ICAO code part
  if (iataCodes && Array.isArray(iataCodes) && iataCodes.length) {
    fs.ensureFile(config.file).then(() => {
      fs.writeFile(config.file, JSON.stringify(iataCodes), (err) => {
        if (err) {
          throw err
        }
        console.log('Wrote ICAO file')
      })
    })
  }
})
