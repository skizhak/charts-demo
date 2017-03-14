import _ from 'lodash'
import {_c, formatter} from 'commons'
const colorScheme = _c.lbColorScheme17

function processFlowParser (data) {
  return data[0]['flowRate']
}

const flowAxisConfig = {
  x: {
    formatter: formatter.extendedISOTime,
    label: 'Time',
    ticks: 5,
  },
  y1: {
    position: 'left',
    ticks: 4,
    formatter: formatter.toNumber,
    labelMargin: 15,
  },
  y2: {
    position: 'right',
    ticks: 4,
    formatter: formatter.toNumber,
    labelMargin: 15,
  }
}

const flowPlotConfig = {
  x: {
    accessor: 'time',
    axis: 'x',
    label: 'Time',
  },
  y: [
    {
      accessor: 'AVG(added_flows)',
      label: 'Added Flows',
      enabled: true,
      chart: 'StackedBarChart',
      color: colorScheme[9],
      axis: 'y1',
    }, {
      accessor: 'AVG(deleted_flows)',
      label: 'Deleted Flows',
      enabled: true,
      chart: 'StackedBarChart',
      color: colorScheme[7],
      axis: 'y1',
    }, {
      accessor: 'AVG(active_flows)',
      label: 'Active Flows',
      enabled: true,
      chart: 'LineChart',
      color: colorScheme[8],
      axis: 'y2',
    }
  ]
}

export default [{
  id: 'node-flow-id',
  type: 'CompositeYChart',
  provider: {
    formatter: processFlowParser,
  },
  config: {
    marginLeft: 60,
    marginRight: 50,
    chartHeight: 275,
    crosshair: 'flow-crosshair-id',
    plot: flowPlotConfig,
    axis: flowAxisConfig,
  }
}, {
  id: 'flow-crosshair-id',
  type: 'Crosshair',
  config: {
    container: 'node-flow-id',
    tooltip: 'flow-tooltip-id',
  }
}, {
  id: 'flow-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'VRouter Flows',
    dataConfig: [
      {
        accessor: 'AVG(active_flows)',
        labelFormatter: 'Active Flows',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'AVG(added_flows)',
        labelFormatter: 'Added Flows',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'AVG(deleted_flows)',
        labelFormatter: 'Deleted Flows',
        valueFormatter: formatter.toNumber,
      }
    ],
  },
}, {
  id: 'flow-navigation-id',
  type: 'Navigation',
  provider: {
    formatter: processFlowParser,
  },
  config: {
    marginLeft: 80,
    marginRight: 60,
    chartHeight: 175,
    plot: flowPlotConfig,
    axis: _.merge({}, flowAxisConfig, {y1: {ticks: 1, label: ''}, y2: {ticks: 1, label: ''}}),
    selection: [50, 100],
    updateComponents: ['node-flow-id'],
  }
}]
