(function () {
  var root = this

  var TimeDifference = function (dateTime) {
    this.dateTime_ = dateTime.getTime()
    var value
    this.getDifference = function (dateTime, config) {
      if (dateTime) {
        dateTime = dateTime.getTime()
        config = config || {}
        value = dateTime - this.dateTime_
        switch (config.unit) {
          case 's':
            value /= 1000.0
            break
          case 'm':
            value /= 60000.0
            break
          case 'h':
            value /= 3600000.0
            break
          case 'd':
            value /= 86400000.0
            break
        }
      }
      if (config.rounding) {
        switch (config.rounding) {
          case 'ceil':
            value = Math.ceil(value)
            break
          case 'floor':
            value = Math.floor(value)
            break
          case 'trunc':
            value = Math.trunc(value)
            break
          default:
            value = Math.round(value)
            break
        }
      }
      return value
    }
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = TimeDifference
    }
    exports.MetarParser = TimeDifference
  } else {
    root.MetarParser = TimeDifference
  }
}).call(this)
