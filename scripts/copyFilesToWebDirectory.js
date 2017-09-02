const fs = require('fs-extra')

// cleanup
fs.removeSync('../webpage')

// copy leaflet
fs.copySync('./node_modules/leaflet/dist/leaflet.css', './webpage/css/leaflet.css')
fs.copySync('./node_modules/leaflet/dist/leaflet.js', './webpage/js/leaflet.js')
fs.copySync('./node_modules/leaflet/dist/images', './webpage/css/images')

// copy page source
fs.copySync('./src', './webpage')

// copy airport list
fs.copySync('./data/supportedAirports.geojson', './webpage/data/airports.geojson')
