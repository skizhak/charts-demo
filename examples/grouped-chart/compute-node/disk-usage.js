import {_c, formatter} from 'commons'
const colorScheme = _c.lbColorScheme17

function pieDataParser (data) {
  return data[0]['diskUsage']
}

export default [{
  id: 'disk-usage-id',
  type: 'PieChart',
  provider: {
    formatter: pieDataParser,
  },
  config: {
    type: 'pie',
    radius: 110,
    chartWidth: 225,
    chartHeight: 225,
    colorScale: d3.scaleOrdinal().range([colorScheme[5], colorScheme[6]]), // eslint-disable-line no-undef
    serie: {
      getValue: serie => serie.value,
      getLabel: serie => serie.fieldName,
      valueFormatter: formatter.byteFormatter1K,
    },
    tooltip: 'disk-usage-tooltip-id',
  },
}, {
  id: 'disk-usage-legend-id',
  type: 'LegendUniversal',
  config: {
    sourceComponent: 'disk-usage-id',
  }
}, {
  id: 'disk-usage-tooltip-id',
  type: 'Tooltip',
  config: {
    dataConfig: [
      {
        accessor: 'value',
        labelFormatter: dPoint => dPoint.fieldName,
        valueFormatter: formatter.byteFormatter1K,
      },
    ],
  },
}]
