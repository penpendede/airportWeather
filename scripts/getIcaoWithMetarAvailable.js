const JSFtp = require('jsftp')
const fs = require('fs-extra')

const config = {
  'local': {
    'file': './data/icaoWithMetarAvailable.json'
  },
  'remote': {
    'host': 'tgftp.nws.noaa.gov',
    'path': '/data/observations/metar/stations'
  }
}

const ftp = new JSFtp({
  'host': config.remote.host
})

ftp.ls(config.remote.path, (err, res) => {
  ftp.raw('quit')
  if (err) {
    throw err
  }
  const iataCodes =
    res.map(entry => entry.name)
      .filter(fileName => fileName.match(/^.{4}\.TXT$/))
      .map(fileName => fileName.substring(0, 4))
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
