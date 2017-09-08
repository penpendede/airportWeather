const fs = require('fs-extra')

const airportDataFromOpenFlights = require('../data/airportDataFromOpenFlights')
const airportDataFromOurAirports = require('../data/airportDataFromOurAirports')
const icaoWithMetarAvailable = require('../data/icaoWithMetarAvailable')
const countries = require('../data/countries.json')

const config = {
  'local': {
    'file': './data/supportedAirports.geojson'
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
      'icao': icao,
      'lon': airportDataForCurrentIcao.longitude,
      'lat': airportDataForCurrentIcao.latitude,
      'alt': airportDataForCurrentIcao.altitude,
      'name': airportDataForCurrentIcao.name,
      'place': airportDataForCurrentIcao.city,
      'country': airportDataForCurrentIcao.country
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
      let countryData = countries.find(entry => entry.code === airportDataForCurrentIcao.countryIso)
      knownAirportsWithCoordinatesWhereMetarIsAvailable.push({
        'icao': icao,
        'lon': airportDataForCurrentIcao.longitude,
        'lat': airportDataForCurrentIcao.latitude,
        'name': airportDataForCurrentIcao.name,
        'place': airportDataForCurrentIcao.municipality,
        'country': countryData
          ? countryData.name
          : airportDataForCurrentIcao.countryIso, // unlikely
        'alt': airportDataForCurrentIcao.elevation
      })
    }
  })
}

console.log('Building an array of geoJSON features')

let geoJsonFeatures = []

knownAirportsWithCoordinatesWhereMetarIsAvailable.forEach(airportData => {
  geoJsonFeatures.push({
    'type': 'Feature',
    'geometry': {
      'type': 'Point',
      'coordinates': [
        parseFloat(airportData.lon),
        parseFloat(airportData.lat)
      ]
    },
    'properties': {
      'icao': airportData.icao,
      'name': airportData.name,
      'place': airportData.place,
      'country': airportData.country,
      'lon': parseFloat(airportData.lon),
      'lat': parseFloat(airportData.lat),
      'alt': parseFloat(airportData.alt)
    }
  })
})

console.log('Writing geoJSON data.')

fs.ensureFile(config.local.file).then(() => {
  fs.writeFile(config.local.file, JSON.stringify({
    'type': 'FeatureCollection',
    'features': geoJsonFeatures
  }), (err) => {
    if (err) {
      throw err
    }
  })
})

console.log('DONE.')
