import {_c, formatter} from 'commons'
const colorScheme = _c.lbColorScheme17

function memStatsParser (data) {
  return data[0]['systemMemory']
}

const memAxisConfig = {
  x: {
    formatter: formatter.extendedISOTime,
    label: 'Time',
    ticks: 3,
  },
  y1: {
    position: 'left',
    ticks: 4,
    formatter: formatter.byteFormatter1K,
    labelMargin: 15,
  },
  y2: {
    position: 'right',
    ticks: 4,
    formatter: formatter.byteFormatter1K,
    labelMargin: 15,
  }
}

const memPlotConfig = {
  x: {
    accessor: 'time',
    axis: 'x',
    label: 'Time',
  },
  y: [
    {
      accessor: 'AVG(free)',
      label: 'Free Memory',
      enabled: true,
      chart: 'LineChart',
      color: colorScheme[2],
      axis: 'y2',
    }, {
      accessor: 'AVG(used)',
      label: 'Used Memory',
      enabled: true,
      chart: 'AreaChart',
      color: colorScheme[7],
      axis: 'y1',
    }, {
      accessor: 'AVG(cached)',
      label: 'Cached Memory',
      enabled: true,
      chart: 'AreaChart',
      color: colorScheme[1],
      axis: 'y1',
    }
  ]
}

export default [{
  id: 'node-memory-id',
  type: 'CompositeYChart',
  provider: {
    formatter: memStatsParser,
  },
  config: {
    marginLeft: 90,
    marginRight: 70,
    chartHeight: 300,
    crosshair: 'mem-crosshair-id',
    possibleChartTypes: {
      y1: ['BarChart', 'LineChart'],
      y2: ['BarChart', 'LineChart'],
    },
    plot: memPlotConfig,
    axis: memAxisConfig,
  }
}, {
  id: 'memory-legend-id',
  type: 'LegendPanel',
  config: {
    sourceComponent: 'node-memory-id',
    editable: {
      colorSelector: true,
      chartSelector: true
    },
    placement: 'horizontal',
    filter: true,
  },
}, {
  id: 'mem-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'Memory Usage',
    dataConfig: [
      {
        accessor: 'AVG(total)',
        labelFormatter: 'Total',
        valueFormatter: formatter.byteFormatter1K,
      }, {
        accessor: 'AVG(used)',
        labelFormatter: 'Used',
        valueFormatter: formatter.byteFormatter1K,
      }, {
        accessor: 'AVG(free)',
        labelFormatter: 'Free',
        valueFormatter: formatter.byteFormatter1K,
      }, {
        accessor: 'AVG(cached)',
        labelFormatter: 'Cached',
        valueFormatter: formatter.byteFormatter1K,
      }, {
        accessor: 'AVG(buffers)',
        labelFormatter: 'Buffers',
        valueFormatter: formatter.byteFormatter1K,
      },
    ],
  },
}, {
  id: 'mem-crosshair-id',
  type: 'Crosshair',
  config: {
    container: 'node-memory-id',
    tooltip: 'mem-tooltip-id',
  }
}]
