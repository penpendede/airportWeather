const fs = require('fs-extra')

// cleanup
fs.removeSync('./website')

// copy leaflet
fs.copySync('./node_modules/leaflet/dist/leaflet.css', './website/css/leaflet.css')
fs.copySync('./node_modules/leaflet/dist/leaflet.js', './website/js/leaflet.js')
fs.copySync('./node_modules/leaflet/dist/images', './website/css/images')

fs.copySync(
  './node_modules/leaflet.markercluster/dist/MarkerCluster.css',
  './website/css/MarkerCluster.css'
)
fs.copySync(
  './node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css',
  './website/css/MarkerCluster.Default.css'
)
fs.copySync(
  './node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
  './website/js/leaflet.markercluster.js'
)

// copy page source
fs.copySync('./src', './website')

// copy airport list
fs.copySync('./data/supportedAirports.geojson', './website/data/airports.geojson')
