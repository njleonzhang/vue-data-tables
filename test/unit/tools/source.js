
export let DELAY = 100

export let data = function() {
  return [
    {
      'content': 'Water flood',
      'flow_no': 'FW201601010001',
      'flow_type': 'Repair',
      'flow_type_code': 'repair'
    },
    {
      'content': 'Lock broken',
      'flow_no': 'FW201601010002',
      'flow_type': 'Repair',
      'flow_type_code': 'repair'
    },
    {
      'content': 'Help to buy some drinks',
      'flow_no': 'FW201601010003',
      'flow_type': 'Help',
      'flow_type_code': 'help'
    }
  ]
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

let serverData = () => {
  let serverData = []
  for (let i = 0; i < 1000; i++) {
    serverData.push({
      content: 'Lock broken' + i,
      flow_no: 'FW20160101000' + i,
      flow_type: i % 2 === 0 ? 'Repair' : 'Help',
      flow_type_code: i % 2 === 0 ? 'repair' : 'help'
    })
  }
  return serverData
}

/*
page: this.currentPage,
pageSize: this.innerPageSize,
sortInfo: this.sortData,
filters: this.filters
*/

export let mockServer = function(res) {
  let datas = serverData().slice()
  // let [...datas] = serverData()
  let allKeys = Object.keys(data()[0])

  // do filter
  res && res.filters && res.filters.forEach(filter => {
    datas = datas.filter(data => {
      let props = (filter.search_prop && [].concat(filter.search_prop)) || allKeys
      return props.some(prop => {
        if (!filter.value || filter.value.length === 0) {
          return true
        }
        return [].concat(filter.value).some(val => {
          return data[prop].toString().toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    })
  })

  // do sort
  if (res.sort && res.sort.order) {
    let order = res.sort.order
    let prop = res.sort.prop
    let isDescending = order === 'descending'

    datas.sort(function(a, b) {
      if (a[prop] > b[prop]) {
        return 1
      } else if (a[prop] < b[prop]) {
        return -1
      } else {
        return 0
      }
    })
    if (isDescending) {
      datas.reverse()
    }
  }

  return {
    data: datas.slice((res.page - 1) * res.pageSize, res.page * res.pageSize),
    req: res,
    ts: new Date(),
    total: datas.length
  }
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
