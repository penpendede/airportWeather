(function () {
  var root = this

  var MetarParser = function (metarString) {
    this.metarString_ = metarString
    let metar = metarString.split(/\s+/)
    this.metarData_ = {
      'pressure': metar.find(part => part.match(/^Q\d\d\d\d$/) || part.match(/^A\d\d\d\d$/)),
      'tempAndDew': metar.find(part => part.match(/^M?\d\d\/M?\d\d$/)),
      'visibility': metar.find(part => part.match(/^\d+$/)) // so far only ISO
    }

    this.getRawMetarData = function () {
      return this.metarString_
    }

    this.getRawMetarParts = function () {
      return this.metarData_
    }

    this.getPressureDescription = function () {
      if (this.metarData_.pressure) {
        let value = parseInt(this.metarData_.pressure.substr(1))
        return (this.metarData_.pressure[0] === 'Q') ? `${value} hPa` : `${value * 0.01} inHg`
      }
    }

    this.getTemperatureDescription = function () {
      if (this.metarData_.tempAndDew) {
        return this.metarData_.tempAndDew.match(/^(M?\d\d)/)[1].replace('M', '-') + ' °C'
      }
    }

    this.getDewPointDescription = function () {
      if (this.metarData_.tempAndDew) {
        return this.metarData_.tempAndDew.match(/(M?\d\d)$/)[1].replace('M', '-') + ' °C'
      }
    }

    this.getVisibilityDescription = function () {
      if (this.metarData_.visibility) {
        let visibility = parseInt(this.metarData_.visibility)
        switch (visibility) {
          case 9999:
            return '10 km or more'
          case 0:
            return 'less than 50 m'
          default:
            if (visibility < 1000) {
              return visibility + ' m'
            } else {
              visibility = this.metarData_.visibility
              return visibility[0] + '.' + visibility.substring(1) + ' km'
            }
        }
      }
    }
  }
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = MetarParser
    }
    exports.mymodule = MetarParser
  } else {
    root.mymodule = MetarParser
  }
}).call(this)
