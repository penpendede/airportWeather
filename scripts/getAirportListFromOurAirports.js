let fs = require('fs-extra')
let https = require('http')
let papaparse = require('papaparse')

let config = {
  'local': {
    'file': './data/airportDataFromOurAirports.json'
  },
  'remote': {
    'host': 'ourairports.com',
    'path': '/data/airports.csv'
  }
}
// Format of data is as follows
// id
// ident
// type
// name
// latitude_deg
// longitude_deg
// elevation_ft
// continent
// iso_country
// iso_region
// municipality
// scheduled_service
// gps_code
// iata_code
// local_code
// home_link",
// wikipedia_link
// keywords

let data = []

https.get(config.remote).on('response', response => {
  response.on('data', chunk => data.push(chunk))
  response.on('end', () => {
    let header, parsed
    [header, ...parsed] = papaparse.parse(data.join(''), config.parseOptions).data
    let selector = {}
    let i = 0
    for (let field of [
      'id', 'identifier',
      'type',
      'latitude', 'longitude', 'elevation',
      'continent', 'countryIso', 'regionIso', 'municipality',
      'scheduledService',
      'gpsCode', 'iataCode', 'localCode',
      'homeLink', 'wikipediaLink', 'keywords'

    ]) {
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
        console.log('Wrote data fetched from ourAirports')
      })
    })
  })
})
