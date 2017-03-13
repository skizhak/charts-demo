/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */
import _ from 'lodash'
import {ChartView} from 'coCharts'
import {dg} from 'commons'
import cpuConfig from './cpu.js'
import memoryConfig from './memory.js'
import flowConfig from './flow.js'
import diskUsageConfig from './disk-usage.js'
import processConfig from './process.js'
import template from './template.html'

const timeInterval = 2000
let now = _.now()
let data = dg.computeNodeData({
  vrCount: 1,
  count: 20,
  flowCount: 60,
  timeInterval: timeInterval,
  now: now,
})

const config = {
  id: 'chartBox',
  template,
  components: [].concat(cpuConfig, memoryConfig, flowConfig, diskUsageConfig, processConfig),
}

let intervalId = -1
const chart = new ChartView()

export default {
  render: () => {
    clearInterval(intervalId)
    const dataUpdate = () => {
      now += timeInterval
      let newDataPoint = dg.computeNodeData({vrCount: 1, count: 1, flowCount: 1, timeInterval: timeInterval, now: now})

      newDataPoint[0].systemCPU = data[0].systemCPU.slice(1).concat(newDataPoint[0].systemCPU)
      newDataPoint[0].systemMemory = data[0].systemMemory.slice(1).concat(newDataPoint[0].systemMemory)
      newDataPoint[0].flowRate = data[0].flowRate.slice(1).concat(newDataPoint[0].flowRate)

      data = newDataPoint
      chart.setData(data)
    }
    chart.setConfig(config)
    dataUpdate()
    intervalId = setInterval(dataUpdate, timeInterval)
  },
  remove: () => {
    chart.remove()
  },
  stopUpdating: () => {
    clearInterval(intervalId)
    intervalId = -1
  }
}
