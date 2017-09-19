
export let DELAY = 100

export let tableData = [{
  'building': '5',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Water flood',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010001',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '111111',
  'room_id': '00501',
  'room_no': '501',
  'state': 'Created',
  'state_code': 'created'
}, {
  'building': '6',
  'building_group': 'Sourth',
  'cellphone': '13400000000',
  'content': 'Lock broken',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010002',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '2222222',
  'room_id': '00701',
  'room_no': '701',
  'state': 'Assigned',
  'state_code': 'assigned'
}, {
  'building': '9',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Help to buy some drinks',
  'create_time': '2016-10-02 22:25',
  'flow_no': 'FW201601010003',
  'flow_type': 'Help',
  'flow_type_code': 'help',
  'id': '2222222',
  'room_id': '00601',
  'room_no': '601',
  'state': 'Closed',
  'state_code': 'closed'
}]

export
let titles = [{
  prop: 'flow_no',
  label: 'No.'
}, {
  prop: 'content',
  label: 'Content'
}, {
  prop: 'create_time',
  label: 'Time',
}, {
  prop: 'state',
  label: 'State'
}, {
  prop: 'flow_type',
  label: 'Type'
}, {
  prop: 'building_group',
  label: 'building'
}, {
  prop: 'building',
  label: 'building'
}, {
  prop: 'room_no',
  label: 'no'
}, {
  prop: 'cellphone',
  label: 'tel'
}]

let serverData = []

for (let i = 0; i < 1000; i++) {
  serverData.push({
    'building': '6',
    'building_group': 'Sourth',
    'cellphone': '13400000000',
    'content': 'Lock broken',
    'create_time': '2016-10-01 22:25',
    'flow_no': 'FW20160101000' + i,
    'flow_type': 'Repair',
    'flow_type_code': 'repair',
    'id': i,
    'room_id': '00701',
    'room_no': '701',
    'state': 'Assigned',
    'state_code': 'assigned'
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
      reject('network error')
    }, time)
  })
}
