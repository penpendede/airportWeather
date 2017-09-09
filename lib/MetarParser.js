(function () {
  var root = this

  var MetarParser = function (metarString) {
    this.metarString_ = metarString
    var metar = metarString.split(/\s+/)
    this.metarData_ = {
      'pressure': metar.find(function (part) { return (part.match(/^Q\d\d\d\d$/) || part.match(/^A\d\d\d\d$/)) }),
      'tempAndDew': metar.find(function (part) { return (part.match(/^M?\d\d\/M?\d\d$/)) }),
      'visibility': metar.find(function (part) { return (part.match(/^\d+$/)) }),
      'dateTime': metar.find(function (part) { return (part.match(/^\d+Z$/)) })
    }

    this.getRawMetarData = function () {
      return this.metarString_
    }

    this.getRawMetarParts = function () {
      return this.metarData_
    }

    this.getPressureDescription = function () {
      if (this.metarData_.pressure) {
        var value = parseInt(this.metarData_.pressure.substr(1))
        return ((this.metarData_.pressure[0] === 'Q') ? value : (value * 0.3386389).toFixed(0)) + ' hPa'
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
        var visibility = parseInt(this.metarData_.visibility)
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

    this.getTime = function () {
      return parseInt(this.metarData_.dateTime.substr(2, 2)) + ':' + this.metarData_.dateTime.substr(4, 2) + ' UTC'
    }
    this.getDayInMonth = function () {
      return parseInt(this.metarData_.dateTime.substr(0, 2))
    }
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = MetarParser
    }
    exports.MetarParser = MetarParser
  } else {
    root.MetarParser = MetarParser
  }
}).call(this)
