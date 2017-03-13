import {_c, formatter} from 'commons'
const colorScheme = _c.lbColorScheme17

function cpuStatsParser (data) {
  return data[0]['systemCPU']
}

const cpuPlotConfig = {
  x: {
    accessor: 'time',
    axis: 'x',
    label: 'Time'
  },
  y: [
    {
      accessor: 'AVG(cpu_share)',
      label: 'Avg CPU Share',
      enabled: true,
      chart: 'LineChart',
      color: colorScheme[7],
      axis: 'y1'
    }, {
      accessor: 'AVG(five_min_avg)',
      label: 'Avg CPU (5 mins)',
      enabled: true,
      chart: 'BarChart',
      color: colorScheme[4],
      axis: 'y2'
    }, {
      accessor: 'AVG(one_min_avg)',
      label: 'Avg CPU (1 min)',
      enabled: true,
      chart: 'BarChart',
      color: colorScheme[1],
      axis: 'y2'
    }
  ]
}

const cpuAxisConfig = {
  x: {
    formatter: formatter.extendedISOTime,
    label: 'Time',
    ticks: 3,
  },
  y1: {
    position: 'left',
    label: '',
    ticks: 4,
    formatter: formatter.toInteger,
    labelMargin: 15,
  },
  y2: {
    position: 'right',
    label: '',
    ticks: 4,
    formatter: formatter.toInteger,
    labelMargin: 15,
  }
}

export default [{
  id: 'node-cpu-id',
  type: 'CompositeYChart',
  provider: {
    formatter: cpuStatsParser,
  },
  config: {
    marginLeft: 60,
    marginRight: 60,
    chartHeight: 300,
    crosshair: 'cpu-crosshair-id',
    possibleChartTypes: {
      y1: ['BarChart', 'LineChart'],
      y2: ['BarChart', 'LineChart']
    },
    plot: cpuPlotConfig,
    axis: cpuAxisConfig,
  }
}, {
  id: 'cpu-legend-id',
  type: 'LegendPanel',
  config: {
    sourceComponent: 'node-cpu-id',
    editable: {
      colorSelector: true,
      chartSelector: true
    },
    placement: 'horizontal',
    filter: true,
  },
}, {
  id: 'cpu-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'CPU Usage',
    dataConfig: [
      {
        accessor: 'AVG(cpu_share)',
        labelFormatter: 'Avg CPU Share',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'AVG(fifteen_min_avg)',
        labelFormatter: 'Avg CPU (15 mins)',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'AVG(five_min_avg)',
        labelFormatter: 'Avg CPU (5 mins)',
        valueFormatter: formatter.toNumber,
      }, {
        accessor: 'AVG(one_min_avg)',
        labelFormatter: 'Avg CPU (1 min)',
        valueFormatter: formatter.toNumber,
      }
    ],
  },
}, {
  id: 'cpu-crosshair-id',
  type: 'Crosshair',
  config: {
    container: 'node-cpu-id',
    tooltip: 'cpu-tooltip-id',
  }
}]
