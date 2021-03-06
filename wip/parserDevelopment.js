let MetarParser = require('../lib/MetarParser')
let TimeDifference = require('../lib/TimeDifference')
// Data for the most important airports in the word and those you typically use to reach the UN city of Bonn
// The date provided by the server is discarded so I use the most important caesura in aviation history
// For the time being only international METAR codes will be supported as my focus is on Afro-Eurasia.
let metarExampleData = [
  'CYYZ 111246Z 26009KT 15SM SCT030 BKN081 BKN240 20/14 A2982 RMK CU3AC3CI1 SLP099 DENSITY ALT 1400FT',
  'EDDF 111246Z 17005KT 140V210 9999 FEW048TCU 19/08 Q1015 NOSIG',
  'EDDK 111246Z VRB02KT 9999 -SHRA FEW052TCU BKN090 16/10 Q1014 NOSIG',
  'EDDL 111246Z VRB02KT CAVOK 18/10 Q1014 NOSIG',
  'EDDM 111246Z 20006KT 9999 VCSH SCT030TCU BKN060 13/08 Q1016 NOSIG',
  'EDDP 111246Z 31006KT CAVOK 15/08 Q1015 NOSIG',
  'EGKK 111246Z 15008KT 6000 -RA FEW009 SCT020 13/12 Q1011',
  'EGLL 111246Z AUTO 16012KT 9000 -RA BKN011 BKN016 OVC043 14/12 Q1010 TEMPO 6000 -RA',
  'EHAM 111246Z 20007KT 9999 FEW043 18/11 Q1013 NOSIG',
  'ELLX 111246Z 18004KT 150V220 CAVOK 16/08 Q1015 NOSIG',
  'KATL 111246Z 30010KT 10SM SCT042 SCT250 BKN300 27/16 A3016 RMK AO2 SLP204 T02670156 $',
  'KCLT 111246Z 01005KT 10SM FEW050 FEW250 27/14 A3011 RMK AO2 SLP189 T02670144 $',
  'KDEN 111246Z 30005KT 10SM FEW110 33/02 A3025 RMK AO2 SLP153 T03280017',
  'KDFW 111246Z 20009KT 10SM FEW130 FEW250 33/19 A3009 RMK AO2 SLP179 T03280189 $',
  'KEWR 111246Z 27008KT 250V310 10SM OVC015 20/17 A2987 RMK AO2 T02000167',
  'KIAH 111246Z 10005KT 10SM SCT040 BKN250 31/22 A3011 RMK AO2 SLP195 T03060217',
  'KIND 111246Z 30009KT 10SM SCT250 27/13 A3004 RMK AO2 SLP167 T02670128',
  'KJFK 111246Z 26013KT 10SM FEW008 BKN030 BKN110 19/19 A2987 RMK AO2 WSHFT 1612 RAE19 SLP115 P0000 T01940189',
  'KLAS 111246Z 00000KT 10SM FEW150 BKN210 32/14 A3008 RMK AO2 SLP156 T03170139',
  'KLAX 111246Z 06003KT 10SM FEW048 FEW110 SCT170 SCT230 36/19 A2992 RMK AO2 SLP128 FU FEW048 T03560189',
  'KMCO 111246Z 07005KT 10SM FEW025 FEW090 BKN120 OVC250 29/24 A3011 RMK AO2 SLP193 T02940239 $',
  'KMEM 111246Z 21004KT 10SM CLR 28/18 A3014 RMK AO2 SLP201 T02780183',
  'KMIA 111246Z 12008KT 10SM SCT035 OVC250 34/27 A3008 RMK AO2 SLP186 T03330272 $',
  'KMSP 111246Z 24009KT 10SM SCT250 26/16 A2992 RMK AO2 SLP128 T02610156',
  'KORD 111246Z 28007KT 10SM FEW050 SCT250 26/14 A3001 RMK AO2 SLP160 T02560144',
  'KPHL 111246Z 27010KT 10SM SCT026 BKN032 OVC048 22/15 A2992 RMK AO2 SLP129 SCT V BKN 60000 T02220150 10222 20183 58006 $',
  'KPHX 111246Z 26007KT 10SM SCT200 BKN250 32/20 A3001 RMK AO2 SLP140 T03220200',
  'KSDF 111246Z VRB04KT 10SM FEW075 24/17 A3007 RMK AO2 SLP179 T02440172',
  'KSEA 111246Z 34006KT 10SM FEW140 BKN220 23/16 A3003 RMK AO2 SLP172 T02280156',
  'KSFO 111246Z 30008KT 8SM BKN050 BKN120 25/14 A2991 RMK AO2 SLP128 T02500139',
  'LEBL 111246Z 11010KT 9999 SCT022 25/20 Q1013 NOSIG',
  'LEMD 111246Z 20008KT CAVOK 31/04 Q1014 NOSIG',
  'LFPG 111246Z 16010KT CAVOK 20/09 Q1013 NOSIG',
  'LIRF 111246Z 29009KT CAVOK 22/12 Q1012 NOSIG',
  'LTBA 111246Z VRB03KT CAVOK 25/13 Q1007 NOSIG',
  'MMMX 111246Z 26005KT 8SM BKN020 OVC080 18/11 A3039 NOSIG RMK 8/27/ HZY BINOVC SC',
  'OMAA 111246Z 04007KT 7000 NSC 33/27 Q1001 NOSIG',
  'OMDB 111246Z 10004KT 070V130 CAVOK 35/22 Q1002 NOSIG',
  'OMDW 111246Z 04004KT 7000 NSC 32/24 Q1003 NOSIG',
  'OTBD 111246Z 14005KT CAVOK 35/26 Q1001 NOSIG',
  'OTHH 111246Z 15007KT CAVOK 36/24 Q1001 NOSIG',
  'PANC 111246Z 34004KT 10SM FEW050 SCT080 BKN140 OVC200 08/06 A2997 RMK AO2 SLP151 VIRGA ALQDS T00780056',
  'RCTP 111246Z 15006KT 9999 FEW015 BKN050 BKN070 26/24 Q1010 NOSIG RMK A2983',
  'RJAA 111246Z 03004KT 9999 -SHRA FEW020 SCT030 BKN070 20/19 Q1015 NOSIG RMK 1CU020 4CU030 6AC070 A2999',
  'RJTT 111246Z 01003KT 9999 -SHRA FEW015 BKN020 BKN050 23/20 Q1015 NOSIG',
  'RKSI 111246Z 05002KT CAVOK 21/16 Q1016 NOSIG',
  'RPLL 111246Z 25004KT 210V270 9999 FEW025 28/28 Q1010 NOSIG RMK A2983',
  'VABB 111246Z 21004KT 4000 HZ FEW020 SCT025 28/26 Q1010 NOSIG',
  'VHHH 111246Z 23012KT 9999 FEW015 SCT040 28/24 Q1005 NOSIG',
  'VIDP 111246Z 00000KT 4000 HZ FEW100 30/25 Q1006 NOSIG',
  'VTBS 111246Z 23004KT 9999 FEW025 28/23 Q1009 NOSIG',
  'WIII 111246Z VRB02KT 5000 HZ FEW020 26/22 Q1011 NOSIG',
  'WMKK 111246Z 00000KT 9000 FEW010 FEW017CB BKN140 25/25 Q1012 NOSIG',
  'WSSS 111246Z 15006KT 9999 FEW018 BKN300 28/25 Q1011 NOSIG',
  'YSSY 111246Z 24014KT CAVOK 15/02 Q1008 FM1700 MOD TURB BLW 5000FT',
  'ZBAA 111246Z 18004MPS 140V300 5000 BR NSC 22/19 Q1011 NOSIG',
  'ZGGG 111246Z 25002MPS 220V280 CAVOK 28/25 Q1006 NOSIG',
  'ZGSZ 111246Z 30004MPS 9999 BKN050 28/26 Q1005 NOSIG',
  'ZPPP 111246Z 21002MPS 9999 SCT023 OVC040 19/17 Q1020 NOSIG',
  'ZSPD 111246Z 11005MPS 9999 FEW013 25/23 Q1012 NOSIG',
  'ZSSS 111246Z 11004MPS 080V140 CAVOK 26/22 Q1011 NOSIG',
  'ZUUU 111246Z 24001MPS 7000 FEW050 23/22 Q1011 NOSIG'
]

// That's a fake
let data = '2001/09/11 08:46 \n' + metarExampleData[Math.floor(Math.random() * metarExampleData.length)]

let timeDifference = new TimeDifference(new Date(2017, 8, 10, 16, 37, 0, 113))

let fakeNow = new Date(2017, 8, 11, 19, 39, 1, 886)

console.log('milliseconds    ' + timeDifference.getDifference(fakeNow))
console.log('seconds (plain) ' + timeDifference.getDifference(fakeNow, {'unit': 's'}))
console.log('seconds (true)  ' + timeDifference.getDifference(fakeNow, {'unit': 's', 'rounding': true}))
console.log('seconds (ceil)  ' + timeDifference.getDifference(fakeNow, {'unit': 's', 'rounding': 'ceil'}))
console.log('seconds (floor) ' + timeDifference.getDifference(fakeNow, {'unit': 's', 'rounding': 'floor'}))
console.log('seconds (trunc) ' + timeDifference.getDifference(fakeNow, {'unit': 's', 'rounding': 'floor'}))
console.log('minutes         ' + timeDifference.getDifference(fakeNow, {'unit': 'm'}))
console.log('minutes (true)  ' + timeDifference.getDifference(fakeNow, {'unit': 'm', 'rounding': true}))
console.log('minutes (ceil)  ' + timeDifference.getDifference(fakeNow, {'unit': 'm', 'rounding': 'ceil'}))
console.log('minutes (floor) ' + timeDifference.getDifference(fakeNow, {'unit': 'm', 'rounding': 'floor'}))
console.log('minutes (trunc) ' + timeDifference.getDifference(fakeNow, {'unit': 'm', 'rounding': 'floor'}))
console.log('hours           ' + timeDifference.getDifference(fakeNow, {'unit': 'h'}))
console.log('hours (true)    ' + timeDifference.getDifference(fakeNow, {'unit': 'h', 'rounding': true}))
console.log('hours (ceil)    ' + timeDifference.getDifference(fakeNow, {'unit': 'h', 'rounding': 'ceil'}))
console.log('hours (floor)   ' + timeDifference.getDifference(fakeNow, {'unit': 'h', 'rounding': 'floor'}))
console.log('hours (trunc)   ' + timeDifference.getDifference(fakeNow, {'unit': 'h', 'rounding': 'floor'}))
console.log('days            ' + timeDifference.getDifference(fakeNow, {'unit': 'd'}))
console.log('days (true)     ' + timeDifference.getDifference(fakeNow, {'unit': 'd', 'rounding': true}))
console.log('days (ceil)     ' + timeDifference.getDifference(fakeNow, {'unit': 'd', 'rounding': 'ceil'}))
console.log('days (floor)    ' + timeDifference.getDifference(fakeNow, {'unit': 'd', 'rounding': 'floor'}))
console.log('days (trunc)    ' + timeDifference.getDifference(fakeNow, {'unit': 'd', 'rounding': 'floor'}))

var metarData = new MetarParser(data.split('\n')[1])
console.log(metarData.getRawMetarData())
console.log(metarData.getRawMetarParts())
console.log('Pressure:     ' + metarData.getPressureDescription())
console.log('Temperature:  ' + metarData.getTemperatureDescription())
console.log('Dew Point:    ' + metarData.getDewPointDescription())
console.log('Visibility:   ' + metarData.getVisibilityDescription())
console.log('Time:         ' + metarData.getTime())
console.log('Day in Month: ' + metarData.getDayInMonth())