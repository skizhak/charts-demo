/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */
import {ChartView, Util} from 'coCharts'
import {formatter, _c} from 'commons'
import * as portDistribution from './port-distribution.json'

const colorScheme = _c.d3ColorScheme10
const bubbleShapes = Util.bubbleShapes

function dataProcesser (data) {
  const portTraffic = [...data.sport, ...data.dport]
  const flattenedData = portTraffic.reduce((flattened, currDataPoint) => {
    const port = (currDataPoint.sport || currDataPoint.dport)
    flattened[port] = flattened[port] || {}
    Object.assign(flattened[port], currDataPoint)
    return flattened
  }, {})

  return Object.keys(flattenedData).map(
    key => Object.assign({
      port: +key,
      inBytes: 0,
      inFlowCount: 0,
      inPkts: 0,
      outBytes: 0,
      outFlowCount: 0,
      outPkts: 0
    }, flattenedData[key])
  )
}

let data = dataProcesser(portDistribution)

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
      filter: true,
    }
  }, {
    id: 'scatter-plot',
    type: 'CompositeYChart',
    provider: {},
    config: {
      chartHeight: 400,
      marginInner: 10,
      marginLeft: 100,
      marginRight: 80,
      marginBottom: 40,
      plot: {
        x: {
          accessor: 'port',
          label: 'Port',
          axis: 'x',
        },
        y: [
          {
            enabled: true,
            accessor: 'inBytes',
            label: 'Port Traffic In',
            chart: 'ScatterPlot',
            sizeAccessor: 'outBytes',
            sizeAxis: 'sizeAxisBytes',
            shape: bubbleShapes.signin,
            color: colorScheme[1],
            axis: 'y1',
            tooltip: 'tooltip-id',
          }, {
            enabled: true,
            accessor: 'outBytes',
            label: 'Port Traffic Out',
            chart: 'ScatterPlot',
            sizeAccessor: 'outBytes',
            sizeAxis: 'sizeAxisBytes',
            shape: bubbleShapes.signout,
            color: colorScheme[2],
            axis: 'y1',
            tooltip: 'tooltip-id',
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
          labelMargin: 15,
        },
      }
    }
  }, {
    id: 'tooltip-id',
    type: 'Tooltip',
    config: {
      title: 'Port Traffic',
      dataConfig: [{
        accessor: 'port',
        labelFormatter: 'Port Number',
      }, {
        accessor: 'inBytes',
        labelFormatter: 'Traffic In',
        valueFormatter: formatter.byteFormatter,
      }, {
        accessor: 'outBytes',
        labelFormatter: 'Traffic Out',
        valueFormatter: formatter.byteFormatter,
      }, {
        accessor: 'inFlowCount',
        labelFormatter: 'Incoming Flow Count',
        valueFormatter: formatter.toInteger,
      }, {
        accessor: 'outFlowCount',
        labelFormatter: 'Outgoing Flow Count',
        valueFormatter: formatter.toInteger,
      }],
    }
  }, {
    id: 'navigation-id',
    type: 'Navigation',
    provider: {},
    config: {
      marginInner: 10,
      marginLeft: 80,
      marginRight: 80,
      marginBottom: 60,
      chartHeight: 250,
      selection: [75, 100],
      plot: {
        x: {
          accessor: 'inBytes',
          label: 'Port Traffic In',
          axis: 'x',
        },
        y: [
          {
            enabled: true,
            accessor: 'outBytes',
            label: 'Port Traffic Out',
            chart: 'ScatterPlot',
            axis: 'y1',
            sizeAccessor: 'outBytes',
            sizeAxis: 'sizeAxisBytes',
            shape: bubbleShapes.circleFill,
            color: colorScheme[4],
          }
        ]
      },
      axis: {
        x: {
          scale: 'scaleLinear',
          formatter: formatter.byteFormatter,
        },
        sizeAxisBytes: {
          range: [100, 200],
        },
        y1: {
          position: 'left',
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
    chart.setData(data)

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
