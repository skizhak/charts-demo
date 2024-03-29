/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */
// Data generator for examples
import _ from 'lodash'

const nodeProcesses = [
  'contrail-analytics-api',
  'contrail-svc-monitor',
  'contrail-vrouter-agent',
  'contrail-control',
  'contrail-collector',
  'contrail-snmp-collector',
  'contrail-alarm-gen:0',
  'cassandra',
  'contrail-control-nodemgr',
  'contrail-config-nodemgr',
  'contrail-analytics-nodemgr',
  'contrail-device-manager',
  'contrail-topology',
  'contrail-query-engine',
  'contrail-dns',
  'contrail-vrouter-nodemgr'
]

function vRouterTraffic (dataConfig = {}) {
  let data = []

  const flowCount = dataConfig['flowCount'] || 65
  const vnCount = dataConfig['vnCount'] || 10
  const ipCount = dataConfig['portCount'] || 10
  const protocolCount = dataConfig['protocolCount'] || 3
  const portCount = dataConfig['portCount'] || 10

  const srcVNArray = createVNArray(vnCount)
  const destVNArray = createVNArray(vnCount)

  const srcIPArray = createIPArray(ipCount)
  const destIPArray = createIPArray(ipCount)

  const protocolArray = createProtocolArray(protocolCount)

  const srcPortArray = createPortArray(portCount)
  const destPortArray = createPortArray(portCount)

  const now = _.now()

  for (let i = 0; i < flowCount; i++) {
    const bytes = _.random(74325736, 474325736)

    const flow = {
      'UuidKey': 'b5ba466a-9e56-42e8-8cf5-e75d27c62' + i,
      'action': 'pass',
      'agg-bytes': bytes,
      'agg-packets': _.round((bytes / 330), 0),
      'destip': destIPArray[_.random(0, destIPArray.length - 1)],
      'destvn': destVNArray[_.random(0, destVNArray.length - 1)],
      'direction_ing': 1,
      'dport': destPortArray[_.random(0, destPortArray.length - 1)],
      'protocol': protocolArray[_.random(0, protocolArray.length - 1)],
      'setup_time': now,
      'sourceip': srcIPArray[_.random(0, srcIPArray.length - 1)],
      'sourcevn': srcVNArray[_.random(0, srcVNArray.length - 1)],
      'sport': srcPortArray[_.random(0, srcPortArray.length - 1)],
      'vrouter': 'a7s12'
    }

    data.push(flow)
  }

  return data
}

function createIPArray (count) {
  let ipArray = []

  for (let i = 0; i < count; i++) {
    ipArray.push('10.1.1.' + _.random(1, 128))
  }

  return ipArray
}

function createProtocolArray (count) {
  let protocolArray = [6, 12, 1]

  for (let i = 0; i < (count - 3); i++) {
    protocolArray.push(_.random(13, 142))
  }

  return protocolArray
}

function createPortArray (count) {
  let portArray = []

  for (let i = 0; i < count; i++) {
    portArray.push(_.random(1, 65535))
  }

  return portArray
}

function createVNArray (count) {
  let vnArray = []

  for (let i = 0; i < count; i++) {
    vnArray.push('vnetwork-' + (i + 1))
  }

  return vnArray
}

function computeNodeData (p = {}) {
  const data = []
  const dataConfig = p || {}

  const vrCount = dataConfig['vrCount'] || 1
  const count = dataConfig['count'] || 25
  const flowCount = dataConfig['flowCount'] || 100
  const timeInterval = dataConfig['timeInterval'] || 60000
  const now = dataConfig['now'] || _.now()

  let nodeName = ''
  let vRouter = {}

  for (let j = 0; j < vrCount; j++) {
    nodeName = 'vRouter' + (j + 1)
    vRouter = {
      vrName: nodeName,
      systemCPU: generateCPU4Node(now, count, timeInterval),
      systemMemory: generateMemory4Node(now, count, timeInterval),
      processCPUMem: generateProcessCPUMem4Node(),
      diskUsage: generateDiskUsage4VR(),
      flowRate: generateFlows4Node(now, flowCount, timeInterval)
    }
    data.push(vRouter)
  }

  return data
}

function generateFlows4Node (now, count, timeInterval) {
  let flows = []
  let flow = {}

  for (let j = 0; j < count; j++) {
    flow = {
      'time': now - ((count - j) * timeInterval),
      'AVG(active_flows)': _.random(180, 230),
      'AVG(added_flows)': _.random(4, 12),
      'AVG(deleted_flows)': _.random(2, 7)
    }
    flows.push(flow)
  }

  return flows
}

function generateCPU4Node (now, count, timeInterval) {
  let cpuUsage = []
  let cpu = {}
  let cpuShare = 0
  let min15 = 0

  for (let j = 0; j < count; j++) {
    cpuShare = _.random(15.10, 20.20)
    min15 = (cpuShare / 3)

    cpu = {
      'time': now - ((count - j) * timeInterval),
      'AVG(cpu_share)': _.round(cpuShare, 2),
      'AVG(fifteen_min_avg)': _.round(min15, 2),
      'AVG(five_min_avg)': _.round(min15 + _.random(-1.01, 1.3), 2),
      'AVG(one_min_avg)': _.round(min15 + _.random(-2.2, 2.1), 2),
    }
    cpuUsage.push(cpu)
  }

  return cpuUsage
}

function generateMemory4Node (now, count, timeInterval) {
  let memUsage = []
  let mem = {}
  let total = 32659700
  let used = 0

  for (let j = 0; j < count; j++) {
    used = _.random(10327400, 25497400)

    mem = {
      'time': now - ((count - j) * timeInterval),
      'AVG(buffers)': _.random(315422, 446422),
      'AVG(cached)': _.random(11118300, 19518300),
      'AVG(free)': total - used,
      'AVG(total)': total,
      'AVG(used)': used
    }
    memUsage.push(mem)
  }

  return memUsage
}

function generateProcessCPUMem4Node () {
  let cpuMemUsage = []
  let cpuMemUsage4Process = {}

  for (let i = 0; i < nodeProcesses.length; i++) {
    cpuMemUsage4Process = {
      'process_name': nodeProcesses[i],
      'AVG(process_cpu_share)': (_.random(0.1, 10)).toFixed(2),
      'AVG(process_mem_res)': _.random(32804, 82804),
      'AVG(process_mem_virt)': _.random(336860, 936860),
    }
    cpuMemUsage.push(cpuMemUsage4Process)
  }

  return cpuMemUsage
}

function generateDiskUsage4VR (partitionCount) {
  partitionCount = partitionCount || 2
  let diskUsage = []

  diskUsage.push({'fieldName': 'Disk Available', 'value': _.random(150000, 160000)})
  diskUsage.push({'fieldName': 'Disk Used', 'value': _.random(68796, 68996)})

  return diskUsage
}

function projectVNTraffic (p = {}) {
  const data = []
  const dataConfig = p || {}

  const vnCount = dataConfig['vnCount'] || 3
  const flowCount = dataConfig['flowCount'] || 50
  const portCount = dataConfig['portCount'] || 10
  const now = _.now()

  let vnName = ''
  let vn = {}

  for (let j = 0; j < vnCount; j++) {
    vnName = 'virtual-network' + (j + 1)
    vn = {
      vnName: vnName,
      vmiCount: _.random(2, 20),
      flows: generateFlows4VN(flowCount, now),
      ports: generatePorts4VN(portCount, vnName)
    }
    data.push(vn)
  }

  return data
}

function generateFlows4VN (flowCount, now) {
  let flows = []
  let flow = {}

  let inTraffic = 0
  let outTraffic = 0

  for (let j = 0; j < flowCount; j++) {
    inTraffic = _.random(256000, 1024000)
    outTraffic = _.random(256000, 1024000)
    flow = {
      time: now - ((flowCount - j) * 60000),
      inTraffic: inTraffic,
      inPacket: Math.floor(inTraffic / 340),
      outTraffic: outTraffic,
      outPacket: Math.floor(outTraffic / 340)
    }
    flows.push(flow)
  }
  return flows
}

function generatePorts4VN (portCount, vnName) {
  let ports = []
  let port = {}

  let inTraffic = 0
  let outTraffic = 0

  for (let j = 0; j < portCount; j++) {
    inTraffic = _.random(1024, 76800)
    outTraffic = _.random(1024, 76800)
    port = {
      vnName: vnName,
      port: _.random(7000, 55535),
      inTraffic: inTraffic,
      inPacket: Math.floor(inTraffic / 340),
      outTraffic: outTraffic,
      outPacket: Math.floor(outTraffic / 340)
    }
    ports.push(port)
  }
  return ports
}

export default {
  projectVNTraffic,
  computeNodeData,
  vRouterTraffic,
}
