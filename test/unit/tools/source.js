
export let DELAY = 100

export let data = function() {
  return [{
    'content': 'Water flood',
    'flow_no': 'FW201601010001',
    'flow_type': 'Repair',
    'flow_type_code': 'repair',
  }, {
    'content': 'Lock broken',
    'flow_no': 'FW201601010002',
    'flow_type': 'Repair',
    'flow_type_code': 'repair',
  }, {
    'content': 'Help to buy some drinks',
    'flow_no': 'FW201601010003',
    'flow_type': 'Help',
    'flow_type_code': 'help'
  }]
}

export
let titles = [{
  prop: 'flow_no',
  label: 'NO.'
}, {
  prop: 'content',
  label: 'Content'
}, {
  prop: 'flow_type',
  label: 'Type'
}]

let serverData = []

for (let i = 0; i < 1000; i++) {
  serverData.push({
    content: 'Lock broken' + i,
    flow_no: 'FW20160101000' + i,
    flow_type: i % 2 === 0 ? 'Repair' : 'Help',
    flow_type_code: i % 2 === 0 ? 'repair' : 'help'
  })
}

/*
page: this.currentPage,
pageSize: this.innerPageSize,
sortInfo: this.sortData,
filters: this.filters
*/

export let mockServer = function(res, time = 200) {
  return new Promise((resolve) => {
    setTimeout(_ => {
      resolve({
        data: serverData.slice((res.page - 1) * res.pageSize, res.page * res.pageSize),
        req: res,
        ts: new Date(),
        total: 1000
      })
    }, time)
  })
}

export let mockServerError = function(res, time = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      reject(new Error('network error'))
    }, time)
  })
}
// fake http
export let http = function(res, time = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      var data = mockServer(res)
      resolve(data)
    }, time)
  })
}
