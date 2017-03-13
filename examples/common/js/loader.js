/*
 * Copyright (c) Juniper Networks, Inc. All rights reserved.
 */

/* global $ */

import '../sass/contrail-charts-examples.scss'
import _ from 'lodash'
import vrTraffic from '../../area-chart/vr-traffic/vr-traffic.js'
import inoutTrafficChart from '../../area-chart/inout-traffic/inout-traffic.js'
import nodeCPUMemChart from '../../bubble-chart/nodes/nodes.js'
import portDistributionChart from '../../bubble-chart/port-distribution/port-distribution.js'
import vRoutersChart from '../../bubble-chart/vrouter-vmi/vrouter-vmi.js'
import queryDBChart from '../../linebar-chart/query-db-rw/query-db.js'
import cpuMemChart from '../../linebar-chart/cpu-mem/cpu-mem.js'
import vRouterTrafficChart from '../../radial-chart/vr-vn-traffic/vr-vn-traffic.js'
import diskUsageChart from '../../radial-chart/disk-usage/disk.js'
import poolUsageChart from '../../radial-chart/pool-usage/pools.js'
import vnDetailChart from '../../grouped-chart/vn-detail/vn-detail.js'
import computeNodeChart from '../../grouped-chart/compute-node/cnode.js'

import exampleDescTemplate from '../template/exampleDesc.html'
/**
 * structure of an example:
 * 'example title': {
 *   template: 'template id', <= optional
 *   view: instance of chart view <= required
 *   info: {
 *     title: 'detailed chart title',
 *     desc: 'chart description'
 *   } <= optional
 * }
 */
const allExamples = {
  'lineBar': {
    'Queries & DB R/W': {
      view: queryDBChart,
      info: {
        title: 'QE Queries on Analytics Node',
        desc: 'Real-time Line vs Stacked Bar chart is used to compare queries and r/w requests to cassandra.'
      }
    },
    'Memory & CPU': {
      view: cpuMemChart,
      info: {
        title: 'vRouter CPU vs Memory',
        desc: 'Line vs Grouped Bar chart is used to compare CPU and Memory of vRouters.'
      }
    },
    'RequireJS': {
      view: {
        type: 'RJS',
        entryPoint: './examples/linebar-chart/requirejs/requirejs-config.js'
      },
      info: {
        title: 'Using AMD loader',
        desc: `This example demonstrate usage of contrail-charts loaded via RequireJS. The example config also
         shows the example of having multiple D3 version requirement in your app environment.
         Chart library require D3 version 4 exported via 'd3v4' and 'd3' export can point to older version of D3`
      }
    }
  },
  'bubble': {
    'Node CPU/Mem': {
      view: nodeCPUMemChart,
      info: {
        title: 'CPU & Memory of Contrail Nodes',
        desc: `Bubble chart with navigation is used to analyze CPU and Memory of different nodes. Each node is
         identified by it's temporary icon. Users can filter the nodes by CPU Share through navigation chart at bottom.`
      }
    },
    'Port Distribution': {
      view: portDistributionChart,
      info: {
        title: 'VN Traffic In/Out across Ports',
        desc: `Top bubble charts displays the traffic in/out over a port range of a virtual network. Different,
         temporary icons are used to identify traffic in and traffic out. Users can filter the ports by traffic through
          navigation chart at bottom.`
      }
    },
    'vRouters': {
      view: vRoutersChart,
      info: {
        title: 'VN, VMI, CPU, Memory of vRouters',
        desc: `Top bubble charts displays virtual networks and interfaces of a vRouter. Users can filter the
         vRouters by CPU share through navigation chart at bottom.`
      }
    }
  },
  'grouped': {
    'Project VN Traffic': {
      template: 'grouped',
      view: vnDetailChart,
      info: {
        title: 'Traffic Analysis for a Project',
        desc: `A combination of three charts used to analyze traffic across VNs under a project. LineBar chart
         shows either total traffic of this project or traffic of VN selected by clicking on Pie chart. Bubble chart
         shows traffic across ports with two icons: one for in-traffic and other one for out-traffic.`
      }
    },
    'Compute Node': {
      view: computeNodeChart,
      info: {
        title: 'Compute Node',
        desc: `A combination of five charts used to analyze these stats of a vRouter node: System/Node CPU/Memory,
        Flows, Process CPU/Memory, Disk Usages. Area chart shows System/Node memory usage. Grouped Bar chart shows
        System/Node CPU usage. Stacked Bar chart with navigation show active, added, and deleted flows. Bubble chart
        shows CPU/Memory of different proceses on that node. Finally, pie chart shows the disk usage of node.`
      }
    }
  },
  'area': {
    'VN Traffic In/Out': {
      view: inoutTrafficChart,
      info: {
        title: 'Traffic in/out of two VNs',
        desc: `Real-time area chart is used to compare the in/out traffic of multiple VNs. Quadrant I displays 
        traffic in and quadrant IV displays traffic out.`
      }
    },
    'vRouter Traffic': {
      view: vrTraffic,
      info: {
        title: 'Traffic of two VRs',
        desc: 'Area chart is used to compare the total traffic of multiple vRouters.'
      }
    }
  },
  'radial': {
    'vRouter Traffic': {
      view: vRouterTrafficChart,
      info: {
        title: 'vRouter Traffic',
        desc: 'A radial dendrogram used to show vRouter traffic between source and destination virtual-network, IP, port.'
      }
    },
    'OSD/Disk Status': {
      view: diskUsageChart,
      info: {
        title: 'OSD status of Ceph cluster',
        desc: 'OSD states under a Ceph cluster are shown via two independent donut charts.'
      }
    },
    'Storage Pools': {
      view: poolUsageChart,
      info: {
        title: 'Pool allocation of Ceph cluster',
        desc: 'Pie chart is used to show storage pool allocation under a Ceph cluster.'
      }
    }
  }
}

const $chartBox = $('#chartBox') // anchor point for mounting the chart
const $exampleDesc = $('#exampleDesc') // anchor point for mounting the example info

_.forEach(allExamples, (examples, chartCategory) => {
  let $links = $(`#${chartCategory}Links`)
  _.forEach(examples, (example, title) => {
    example.title = title
    example.category = chartCategory
    var $link = createLink(example)
    $links.append($('<li>').append($link))
  })
})

function _viewRenderInit ({view, info = {title: '', desc: ''}}) {
  let currentView = $chartBox.data('chartView')
  if (currentView) {
    currentView.remove()
    if (currentView.stopUpdating) currentView.stopUpdating()
  }

  // Cleanup and apply containers template
  $exampleDesc.empty()
  $chartBox.empty()
  // set current view
  $chartBox.data('chartView', view)
  // Add example info
  if (!_.isNil(info)) {
    $exampleDesc.append(exampleDescTemplate({
      title: info.title,
      desc: info.desc,
    }))
  }
  view.render()
}

function _RJSInit (example) {
  const RJSInitFlag = 'RJSInstantiated'
  const view = example.view
  if (view.status && view.status === RJSInitFlag) {
    _viewRenderInit(example)
  } else {
    // Load the entry point
    let entryPoint = document.createElement('script')
    entryPoint.src = 'node_modules/requirejs/require.js'
    entryPoint.setAttribute('data-main', view.entryPoint)
    document.body.append(entryPoint)
    // Once the require entry point load is complete (not just the file load but all dependencies),
    // the script callback will invoke render callback.
    window.AMDRenderCB = (RJSChartView) => {
      example.view = _.extend({status: RJSInitFlag}, view, RJSChartView)
      _viewRenderInit(example)
    }
  }
}

function createLink (example) {
  const chartType = example.category || ''
  const view = example.view
  const cleaned = encodeURIComponent(example.title.replace(/\s/g, '').replace(/&/g, '').replace(/\//g, ''))
  const link = `<a id="${chartType}${cleaned}" href="#${chartType}${cleaned}">
    <span class="nav-text">${example.title}</span>
    </a>`
  const $link = $(link)
  if (view.type === 'RJS') {
    $link.click(e => _RJSInit(example))
  } else {
    $link.click(e => _viewRenderInit(example))
  }
  return $link
}

const exampleId = window.location.hash || '#groupedProjectVNTraffic'
$(exampleId).click()
