/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */
import _ from 'lodash'
import {ChartView, Util} from 'coCharts'
import {formatter, _c} from 'commons'

const bubbleShapes = Util.bubbleShapes
const colorScheme = _c.bubbleColorScheme6

const vmiData = []
let length = 100

for (let i = 0; i < length; i++) {
  vmiData.push({
    name: 'vrouter' + (i + 1),
    cpu: _.random(0, (i < 0.6 * length) ? 30 : ((i < 0.8 * length) ? 80 : 100)),
    size: _.random(0, 1000),
    vmi: _.random(1, (i < 0.2 * length) ? 1000 : ((i < 0.8 * length) ? 700 : 300)),
    vn: _.random(1, (i < 0.2 * length) ? 50 : ((i < 0.8 * length) ? 25 : 12)),
    memory: (_.random(0, (i < 0.6 * length) ? 3 : ((i < 0.8 * length) ? 8 : 10))) * 10240000,
  })
}

const config = {
  id: 'chartBox',
  components: [{
    type: 'LegendPanel',
    config: {
      sourceComponent: 'scatter-plot',
      palette: _c.bubbleColorScheme13,
      editable: {
        colorSelector: true,
        chartSelector: false
      },
      placement: 'horizontal',
      filter: false,
    }
  }, {
    id: 'scatter-plot',
    type: 'CompositeYChart',
    provider: {},
    config: {
      marginInner: 10,
      marginLeft: 80,
      marginRight: 80,
      marginBottom: 40,
      chartHeight: 400,
      plot: {
        x: {
          accessor: 'vmi',
          axis: 'x',
          label: 'Interfaces',
        },
        y: [
          {
            enabled: true,
            accessor: 'vn',
            chart: 'ScatterPlot',
            label: 'vRouters',
            sizeAccessor: 'size',
            sizeAxis: 'sizeAxis',
            shape: bubbleShapes.certificate,
            axis: 'y1',
            color: colorScheme[3],
            tooltip: 'tooltip-id',
          }
        ]
      },
      axis: {
        x: {
          scale: 'scaleLinear',
          formatter: formatter.toInteger,
        },
        sizeAxis: {
          range: [100, 500],
        },
        y1: {
          position: 'left',
          formatter: formatter.toInteger,
          label: 'Virtual Networks',
        }
      },
    }
  }, {
    id: 'tooltip-id',
    type: 'Tooltip',
    config: {
      title: 'vRouter Memory & CPU',
      dataConfig: [
        {
          accessor: 'name',
          labelFormatter: 'vRouter'
        }, {
          accessor: 'vmi',
          labelFormatter: 'Interfaces',
          valueFormatter: formatter.toInteger
        }, {
          accessor: 'vn',
          labelFormatter: 'Virtual Networks',
          valueFormatter: formatter.toInteger
        }, {
          accessor: 'cpu',
          labelFormatter: 'CPU Share(%)',
          valueFormatter: formatter.toFixed1,
        }, {
          accessor: 'memory',
          labelFormatter: 'Memory',
          valueFormatter: formatter.byteFormatter,
        }
      ]
    }
  }, {
    id: 'navigation-id',
    type: 'Navigation',
    provider: {},
    config: {
      marginInner: 10,
      marginLeft: 80,
      marginRight: 80,
      marginBottom: 40,
      chartHeight: 250,
      selection: [50, 100],
      plot: {
        x: {
          accessor: 'cpu',
          label: 'CPU Share (%)',
          axis: 'x',
        },
        y: [
          {
            enabled: true,
            accessor: 'memory',
            chart: 'ScatterPlot',
            axis: 'y1',
            sizeAccessor: 'size',
            sizeAxis: 'sizeAxis',
            shape: bubbleShapes.square,
            color: colorScheme[5],
          }
        ]
      },
      axis: {
        x: {
          scale: 'scaleLinear',
          formatter: formatter.toFixed1,
        },
        sizeAxis: {
          range: [50, 250],
        },
        y1: {
          position: 'left',
          label: 'Memory',
          formatter: formatter.byteFormatter,
          labelMargin: 15,
          ticks: 4,
        }
      },
    }
  }]
}

const chart = new ChartView()

export default {
  render: () => {
    chart.setConfig(config)
    chart.setData(vmiData)

    // Update pie chart data on Navigation zoom
    const navigation = chart.getComponent('navigation-id')
    const zoom = navigation.actionman.get('Zoom')
    const scatterPlot = chart.getComponent('scatter-plot')
    zoom.on('fired', (componentIds, {accessor, range}) => {
      const data = navigation.model.filter(accessor, range)
      scatterPlot.model.data = data
    })
  },
  remove: () => {
    chart.remove()
  }
}
