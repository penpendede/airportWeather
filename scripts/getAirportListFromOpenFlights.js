const fs = require('fs-extra')
const https = require('https')
const papaparse = require('papaparse')

const config = {
  'local': {
    'file': './data/airportDataFromOpenFlights.json'
  },
  'remote': {
    'host': 'raw.githubusercontent.com',
    'path': '/jpatokal/openflights/master/data/airports-extended.dat'
  }
}
// Format of data is as follows
// Airport ID             Unique OpenFlights identifier for this airport.
// Name                   Name of airport. May or may not contain the City name.
// City                   Main city served by airport. May be spelled differently from Name.
// Country                Country or territory where airport is located. See countries.dat to cross-reference to
//                        ISO 3166-1 codes.
// IATA                   3-letter IATA code. Null if not assigned/unknown.
// ICAO                   4-letter ICAO code. Null if not assigned.
// Latitude               Decimal degrees, usually to six significant digits. Negative is South, positive is North.
// Longitude              Decimal degrees, usually to six significant digits. Negative is West, positive is East.
// Altitude               In feet.
// Timezone               Hours offset from UTC. Fractional hours are expressed as decimals, eg. India is 5.5.
// DST                    Daylight savings time. One of E (Europe), A (US/Canada), S (South America), O (Australia),
//                        Z (New Zealand), N (None) or U (Unknown).
// Tz database time zone  Timezone in "tz" (Olson) format, eg. "America/Los_Angeles".
// Type                   Type of the airport. Value "airport" for air terminals, "station" for train stations,
//                        "port" for ferry terminals and "unknown" if not known.
// Source                 Source of this data. "OurAirports" for data sourced from OurAirports, "Legacy" for old data
//                        not matched to OurAirports (mostly DAFIF), "User" for unverified user contributions.

let data = []

https.get(config.remote).on('response', response => {
  response.on('data', chunk => data.push(chunk))
  response.on('end', () => {
    let parsed = papaparse.parse(data.join(''), config.parseOptions).data
    let selector = {}
    let i = 0
    for (let field of [
      'id', 'name',
      'city', 'country',
      'iata', 'icao',
      'latitude', 'longitude', 'altitude',
      'timezone', 'dst', 'tz',
      'type', 'source'
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
        console.log('Wrote data fetched from openFlights')
      })
    })
  })
})
