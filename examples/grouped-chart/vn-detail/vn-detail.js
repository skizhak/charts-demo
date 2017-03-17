/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */
import _ from 'lodash'
import {ChartView, Util} from 'coCharts'
import {_c, formatter, dg} from 'commons'
import template from './template.html'

const data = dg.projectVNTraffic({vnCount: 4, flowCount: 50})
const colorScheme = _c.d3ColorScheme20
const bubbleShapes = Util.bubbleShapes

function pieDataParser (data) {
  _.each(data, (vn) => {
    // Data parser for pie
  })
  return data
}

function trafficStatsParser (data) {
  let tsData = []
  if (data.length > 1) {
    const sum = _.reduce(data, function (sum, vn) {
      _.each(vn['flows'], (flow, index) => {
        _.set(sum, `flows.${index}.inTraffic`, (_.get(sum, `flows.${index}.inTraffic`) || 0) + flow.inTraffic)
        _.set(sum, `flows.${index}.outTraffic`, (_.get(sum, `flows.${index}.outTraffic`) || 0) + flow.outTraffic)
        _.set(sum, `flows.${index}.inPacket`, (_.get(sum, `flows.${index}.inPacket`) || 0) + flow.inPacket)
        _.set(sum, `flows.${index}.outPacket`, (_.get(sum, `flows.${index}.outPacket`) || 0) + flow.outPacket)
        _.set(sum, `flows.${index}.time`, flow.time)
      })
      return sum
    }, {})
    tsData = sum['flows']
  } else {
    tsData = data[0]['flows']
  }

  return tsData
}

function portStatsParser (data) {
  let tsData = []

  for (let k = 0; k < data.length; k++) {
    tsData = tsData.concat(data[k].ports)
  }
  return tsData
}

const trafficPlotConfig = {
  x: {
    accessor: 'time',
    axis: 'x',
    label: 'Time',
  },
  y: [
    {
      accessor: 'inTraffic',
      label: 'Traffic In',
      enabled: true,
      chart: 'BarChart',
      color: colorScheme[0],
      axis: 'y1',
    }, {
      accessor: 'outTraffic',
      label: 'Traffic Out',
      enabled: true,
      chart: 'BarChart',
      color: colorScheme[2],
      axis: 'y1',
    }, {
      accessor: 'inPacket',
      label: 'Packets In',
      enabled: true,
      chart: 'LineChart',
      color: colorScheme[1],
      axis: 'y2',
    }, {
      accessor: 'outPacket',
      label: 'Packets Out',
      enabled: true,
      chart: 'LineChart',
      color: colorScheme[3],
      axis: 'y2',
    }
  ]
}

const trafficPlotAxisConfig = {
  x: {
    formatter: formatter.extendedISOTime,
    label: 'Time',
    ticks: 6,
  },
  y1: {
    position: 'left',
    label: 'Traffic',
    ticks: 4,
    formatter: formatter.byteFormatter,
    labelMargin: 15,
  },
  y2: {
    position: 'right',
    label: 'Packets',
    ticks: 4,
    formatter: formatter.commaGroupedInteger,
    labelMargin: 15,
  }
}

const config = {
  id: 'chartBox',
  template,
  components: [],
}

config.components.push(...[{
  id: 'donut-chart-id',
  type: 'PieChart',
  provider: {
    formatter: pieDataParser,
  },
  config: {
    type: 'donut',
    radius: 110,
    chartWidth: 275,
    chartHeight: 275,
    marginTop: 50,
    colorScale: d3.scaleOrdinal().range([colorScheme[4], colorScheme[6], colorScheme[7], colorScheme[8]]), // eslint-disable-line no-undef
    serie: {
      getValue: serie => serie.vmiCount,
      getLabel: serie => serie.vnName,
      valueFormatter: formatter.commaGroupedInteger,
    },
    tooltip: 'tooltip-id',
    onClickNode: data => {
      chart.getComponent('vn-traffic').model.data = [data]
      chart.getComponent('vn-ports').model.data = [data]
    },
    onClickCursor: true,
  },
}, {
  id: 'tooltip-id',
  type: 'Tooltip',
  config: {
    dataConfig: [
      {
        accessor: 'vmiCount',
        labelFormatter: 'VMI Count for VN',
        valueFormatter: formatter.commaGroupedInteger,
      },
    ],
  },
}, {
  id: 'legend-donut',
  type: 'LegendUniversal',
  config: {
    sourceComponent: 'donut-chart-id',
  },
}])

config.components.push(...[{
  id: 'vn-traffic',
  type: 'CompositeYChart',
  provider: {
    formatter: trafficStatsParser,
  },
  config: {
    marginLeft: 80,
    marginRight: 80,
    chartHeight: 275,
    crosshair: 'crosshair-id',
    possibleChartTypes: {
      y1: ['BarChart', 'LineChart'],
      y2: ['BarChart', 'LineChart'],
    },
    plot: trafficPlotConfig,
    axis: trafficPlotAxisConfig,
  }
}, {
  id: 'navigation-id',
  type: 'Navigation',
  provider: {
    formatter: trafficStatsParser,
  },
  config: {
    marginInner: 10,
    marginLeft: 80,
    marginRight: 80,
    chartHeight: 175,
    plot: trafficPlotConfig,
    axis: _.merge({}, trafficPlotAxisConfig, {
      y1: {
        ticks: 1,
        label: '',
      },
      y2: {
        ticks: 1,
        label: '',
      }
    }),
    selection: [50, 100],
  }
}, {
  id: 'legend-panel-id',
  type: 'LegendPanel',
  config: {
    sourceComponent: 'vn-traffic',
    editable: {
      colorSelector: true,
      chartSelector: true,
    },
    placement: 'horizontal',
    filter: true,
  },
}, {
  id: 'xy-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'Traffic of selected VN',
    dataConfig: [
      {
        accessor: 'inTraffic',
        labelFormatter: 'Traffic In',
        valueFormatter: formatter.byteFormatter,
      }, {
        accessor: 'outTraffic',
        labelFormatter: 'Traffic Out',
        valueFormatter: formatter.byteFormatter,
      }, {
        accessor: 'inPacket',
        labelFormatter: 'Packets In',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'outPacket',
        labelFormatter: 'Packets Out',
        valueFormatter: formatter.toNumber,
      }
    ],
  },
}, {
  id: 'crosshair-id',
  type: 'Crosshair',
  config: {
    container: 'vn-traffic',
    tooltip: 'xy-tooltip-id',
  }
}])

config.components.push(...[{
  id: 'vn-ports',
  type: 'CompositeYChart',
  provider: {
    formatter: portStatsParser,
  },
  config: {
    chartHeight: 320,
    marginLeft: 100,
    plot: {
      x: {
        accessor: 'port',
        label: 'Port',
        axis: 'x',
      },
      y: [
        {
          enabled: true,
          accessor: 'inTraffic',
          label: 'Port Traffic In',
          chart: 'ScatterPlot',
          sizeAccessor: 'outBytes',
          sizeAxis: 'sizeAxisBytes',
          shape: bubbleShapes.signin,
          color: colorScheme[0],
          axis: 'y1',
          tooltip: 'port-tooltip-id',
        }, {
          enabled: true,
          accessor: 'outTraffic',
          label: 'Port Traffic Out',
          chart: 'ScatterPlot',
          sizeAccessor: 'outBytes',
          sizeAxis: 'sizeAxisBytes',
          shape: bubbleShapes.signout,
          color: colorScheme[2],
          axis: 'y1',
          tooltip: 'port-tooltip-id',
        }
      ]
    },
    axis: {
      x: {
        scale: 'scaleLinear',
        formatter: formatter.toInteger,
        labelMargin: 5,
      },
      sizeAxisBytes: {
        range: [200, 400],
      },
      y1: {
        position: 'left',
        formatter: formatter.byteFormatter,
        ticks: 5,
        labelMargin: 15,
      },
    }
  }
}, {
  id: 'legend-panel-id2',
  type: 'LegendPanel',
  config: {
    sourceComponent: 'vn-ports',
    palette: _c.bubbleColorScheme13,
    editable: {
      colorSelector: true,
      chartSelector: false,
    },
    placement: 'horizontal',
    filter: true,
  }
}, {
  id: 'port-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'Port Traffic',
    dataConfig: [
      {
        accessor: 'vnName',
        labelFormatter: 'Virtual Network',
      }, {
        accessor: 'port',
        labelFormatter: 'Port Number',
      }, {
        accessor: 'inTraffic',
        labelFormatter: 'Traffic In',
        valueFormatter: formatter.byteFormatter,
      }, {
        accessor: 'outTraffic',
        labelFormatter: 'Traffic Out',
        valueFormatter: formatter.byteFormatter,
      }
    ]
  }
}])

const chart = new ChartView()

export default {
  render: () => {
    chart.setConfig(config)
    chart.setData(data)
  },
  remove: () => {
    chart.remove()
  }
}
