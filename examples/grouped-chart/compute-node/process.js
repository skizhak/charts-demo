import {Util} from 'coCharts'
import {_c, formatter} from 'commons'
const bubbleColorScheme = _c.bubbleColorScheme6
const bubbleShapes = Util.bubbleShapes

function processCPUMemParser (data) {
  return data[0]['processCPUMem']
}

export default [{
  id: 'process-scatter-plot-id',
  type: 'CompositeYChart',
  provider: {
    formatter: processCPUMemParser,
  },
  config: {
    chartHeight: 320,
    marginLeft: 100,
    marginBottom: 60,
    plot: {
      x: {
        accessor: 'AVG(process_cpu_share)',
        label: 'Avg CPU Share for Process',
        axis: 'x',
      },
      y: [
        {
          enabled: true,
          accessor: 'AVG(process_mem_res)',
          label: 'Avg Memory for Process',
          chart: 'ScatterPlot',
          sizeAccessor: 'AVG(process_mem_virt)',
          sizeAxis: 'sizeAxisBytes',
          shape: bubbleShapes.sun,
          color: bubbleColorScheme[5],
          axis: 'y1',
          tooltip: 'process-tooltip-id',
        }
      ]
    },
    axis: {
      x: {
        scale: 'scaleLinear',
        formatter: formatter.toFixed1,
        labelMargin: 5,
      },
      sizeAxisBytes: {
        range: [200, 400],
      },
      y1: {
        position: 'left',
        formatter: formatter.byteFormatter1K,
        ticks: 4,
        labelMargin: 15,
      },
    }
  }
}, {
  id: 'process-tooltip-id',
  type: 'Tooltip',
  config: {
    title: 'Process CPU Memory',
    dataConfig: [
      {
        accessor: 'process_name',
        labelFormatter: 'Process',
      }, {
        accessor: 'AVG(process_cpu_share)',
        labelFormatter: 'AVG CPU Share',
      }, {
        accessor: 'AVG(process_mem_res)',
        labelFormatter: 'Avg Memory Res',
        valueFormatter: formatter.byteFormatter1K,
      }, {
        accessor: 'AVG(process_mem_virt)',
        labelFormatter: 'Avg Memory Virt',
        valueFormatter: formatter.byteFormatter1K,
      }
    ]
  }
}]
