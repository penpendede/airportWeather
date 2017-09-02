let data = `2017/09/02 18:50
EDDK 021850Z VRB01KT 9999 FEW040CB SCT100 13/11 Q1019 NOSIG`

let formattedDateTime = (year, month, day, hour, minute) => {
  return `${parseInt(day)} ` +
    [
      'January',
      'February',
      'March',
      'April',
      'Mai',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ][parseInt(month) - 1] +
    ` ${year}, ${hour}:${minute}`
}

let formattedPressure = pressure => {
  let value = parseInt(pressure.substr(1))
  switch (pressure[0]) {
    case 'Q':
      return `${value} hPa`
    case 'A':
      return `${value * 0.01} inHg`
  }
}

let formattedTemperature = tempAndDew => {
  return tempAndDew.match(/^(M?\d\d)/)[1].replace('M', '-') + ' °C'
}

let formattedDewPoint = tempAndDew => {
  return tempAndDew.match(/(M?\d\d)$/)[1].replace('M', '-') + ' °C'
}

let formattedVisibility = visibility => parseInt(visibility) + ' m'

let date, metar
[date, metar] = data.split('\n')

let dummy, year, month, day, hour, minute
[dummy, year, month, day, hour, minute] = date.match(/^(\d\d\d\d)\/(\d\d)\/(\d\d)\s+(\d\d):(\d\d)$/)

metar = metar.split(/\s+/)
let pressure = metar.find(part => part.match(/^Q\d\d\d\d$/) || part.match(/^A\d\d\d\d$/))
let tempAndDew = metar.find(part => part.match(/^M?\d\d\/M?\d\d$/))
let visibility = metar.find(part => part.match(/^\d+$/))

console.log(metar)
console.log('Date/Time:   ' + formattedDateTime(year, month, day, hour, minute))
console.log('Pressure:    ' + formattedPressure(pressure))
console.log('Temperature: ' + formattedTemperature(tempAndDew))
console.log('Dew Point:   ' + formattedDewPoint(tempAndDew))
console.log('Visibility:  ' + formattedVisibility(visibility))
