const fs = require('fs-extra')

const airportDataFromOpenFlights = require('../data/airportDataFromOpenFlights')
const airportDataFromOurAirports = require('../data/airportDataFromOurAirports')
const icaoWithMetarAvailable = require('../data/icaoWithMetarAvailable')

const config = {
  'local': {
    'file': './data/supportedAirports.json'
  }
}

let knownAirports = []

console.log('Extracting ICAO codes from OpenFlights data.')

// airports from OpenFlights that have ICAO code
airportDataFromOpenFlights.forEach(record => {
  if (record.icao) {
    knownAirports.push(record.icao)
  }
})

console.log('Extracting ICAO codes from OurAirports data.')

// airports from OurAirports that seemingly have ICAO code
airportDataFromOurAirports.forEach(record => {
  if (record.id !== '') {
    if (record.gpsCode && record.gpsCode.match(/^[A-Z][A-Z0-9][A-Z0-9][A-Z0-9]$/)) {
      knownAirports.push(record.gpsCode)
    } else if (record.identifier && record.identifier.match(/^[A-Z][A-Z0-9][A-Z0-9][A-Z0-9]$/)) {
      knownAirports.push(record.identifier)
    }
  }
})

console.log('Making sure each ICAO code is listed only once.')

knownAirports = Array.from(new Set(knownAirports))

let knownAirportsWithMetarAvailable = []

console.log('Dropping all ICAO codes for which no METAR data is available.')

knownAirports.forEach(icao => {
  if (icaoWithMetarAvailable.indexOf(icao) >= 0) {
    knownAirportsWithMetarAvailable.push(icao)
  }
})

let airportsThatStillNeedCoordinates = []
let knownAirportsWithCoordinatesWhereMetarIsAvailable = []

// For now we only extract ICAO code, longitude, and latitude.
// That's the minimum to make the map functional but nothing more.
// Other information will be extracted once whe have a functional prototype.

console.log('Searching coordinates in OpenFlights data.')

knownAirportsWithMetarAvailable.forEach(icao => {
  let airportDataForCurrentIcao = airportDataFromOpenFlights.find(entry => entry.icao === icao)
  if (airportDataForCurrentIcao &&
    !isNaN(airportDataForCurrentIcao.longitude) &&
    !isNaN(airportDataForCurrentIcao.latitude)) {
    knownAirportsWithCoordinatesWhereMetarIsAvailable.push({
      'id': icao,
      'lon': airportDataForCurrentIcao.longitude,
      'lat': airportDataForCurrentIcao.latitude
    })
  } else {
    airportsThatStillNeedCoordinates.push(icao)
  }
})

if (airportsThatStillNeedCoordinates.length) {
  console.log('Searching coordinates in OurAirports data.')
  airportsThatStillNeedCoordinates.forEach(icao => {
    let airportDataForCurrentIcao = airportDataFromOurAirports.find(entry => {
      return (entry.gpsCode === icao) || (entry.identifier === icao)
    })
    if (airportDataForCurrentIcao &&
      !isNaN(airportDataForCurrentIcao.longitude) &&
      !isNaN(airportDataForCurrentIcao.latitude)) {
      knownAirportsWithCoordinatesWhereMetarIsAvailable.push({
        'id': icao,
        'lon': airportDataForCurrentIcao.longitude,
        'lat': airportDataForCurrentIcao.latitude
      })
    }
  })
}

console.log('Writing the data that will be displayed on the map.')

fs.ensureFile(config.local.file).then(() => {
  fs.writeFile(config.local.file, JSON.stringify(
    knownAirportsWithCoordinatesWhereMetarIsAvailable
  ), (err) => {
    if (err) {
      throw err
    }
    console.log('Wrote data.')
    console.log(`Number of supported airports: ${knownAirportsWithCoordinatesWhereMetarIsAvailable.length}`)
  })
})


console.log('DONE.')
