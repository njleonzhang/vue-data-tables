# server-side data source (Load massive data)
In previous section, we always fetch all data from server with single http request. But sometimes,
you may have massive data in sever and it is impossible to load all data to the web page. In this
scenario, component `DataTablesServer` can be used.

`DataTablesServer` basically have same feature to `DataTables`, which means you also have customizable
action bar, action columns, pagination and so on.

> when you use `DataTables`, you may provide `filterFunction` for some props to define special filter logic.
for `DataTablesServer` `filterFunction` doesn't work, because the filter is not made in front-end but in server-side,
when you use `DataTablesServer`


## import DataTablesServer to your project

```
import { DataTablesServer } from 'vue-data-tables'
Vue.use(DataTablesServer)
```

## working mode

`DataTablesServer` can be used in two mode: `auto loading mode` and `free mode`.
In both mode, you must provide the following props:

 | Property | Desc | Type | Default value |
 | -- | -- | -- | -- |
 | data | The data array which will be render in the table. | Array | - |
 | total | count of data in server side | number | - |

### auto loading mode

 In this mode, `DataTablesServer` help to show and hide `loading` along with Http request.
 Provide property `load-data` to enable this mode.

 | Property | Desc | Type | Parameter | Return value |
 | -- | -- | -- | -- | -- |
 | load-data | The function called by `DataTablesServer` to loading data when table initializing or any changes happens on page, page size, search value, checkbox filter value or custom filter  | Function | `Object` which represents the table state | must return a `Promise` instance |


 properties of load-data parameter

 | Property | Desc | Type | format | possible value |
 | - | - | - | - | - |
 | type | indicate why the loadData function called | String | - | 'init'<br>'sizeChange'<br>'pageChange'<br>'checkBoxChange'<br>'sortChange'<br>'customFilterChange'  |
 | page | current page of the table | number | - | - |
 | pageSize | page size of the table | number | - | - |
 | sortInfo | sort info of the table | Object | {<br>&nbsp;&nbsp;order, <br>&nbsp;&nbsp;prop<br>} | order: 'ascending or descending' |

```html
/*vue*/
<desc>
* load data and handle http result both in `load-data`
</desc>
<template>
  <data-tables-server
    :data='data'
    :total='total'
    :checkbox-filter-def="checkboxFilterDef"
    :load-data="loadData">
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
      sortable="custom"/>
  </data-tables-server>
</template>

<script>
// fake server
let serverData = []
for (let i = 0; i < 1000; i++) {
  serverData.push({
    'content': 'Lock broken' + i,
    'flow_no': 'FW20160101000' + i,
    'flow_type': i % 2 === 0 ? 'Repair' : 'Help',
    'flow_type_code': i % 2 === 0 ? 'repair' : 'help',
  })
}

let mockServer = function(res) {
  let datas = serverData.slice()
  let allKeys = Object.keys(data[0])

  // do filter
  res.filters.forEach(filter => {
    datas = datas.filter(data => {
      let props = filter.props || allKeys
      return props.some(prop => {
        if (!filter.vals || filter.vals.length === 0) {
          return true
        }
        return filter.vals.some(val => {
           return data[prop].toString().toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    })
  })

  // do sort
  if (res.sortInfo.order) {
    let order = res.sortInfo.order
    let prop = res.sortInfo.prop
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

let i = 1

// fake http
function http(res, time = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      i++ % 5 !== 0
        ? resolve(mockServer(res))
        : reject('network error')
    }, time)
  })
}

export default {
  data() {
    return {
      data: [],
      titles,
      total: 0,
      checkboxFilterDef: {
        props: 'flow_type_code',
        def: [{
          'code': 'repair',
          'name': 'Repair'
        }, {
          'code': 'help',
          'name': 'Help'
        }]
      }
    }
  },
  methods: {
    loadData(queryInfo) {
      return http(queryInfo, 1000)
        .then(data => {
          this.data = data.data
          this.total = data.total
        })
        .catch(error => {
          this.$message(error)
        })
    }
  }
}
</script>
```

>  Notice: `load-data` function must return a `Promise` instance, it should be resolved when http request successes,
   should be reject when http request fails.

## free mode
  In this mode, `DataTablesServer` just render the table according to the property you provide, you need to handle `loading` yourself.
  `auto loading mode` should be enough for most scenario, but if you want to handle `loading` yourself for some special
  reason, use `free mode`

  To enable this mode, don't provide `load-data` property, but provide `loading` property and leverage event `query-change`.


  | Property | Desc | Type |
  | -- | -- | -- | -- | -- |
  | loading | indicate if `loading` shows. `true` make `loading` shows, `false` make `loading` hides | Boolean  |


 | Event | Desc | Payload |
 | - | - | - |
 | query-change | emit when any changes happens on page, page size, search value, checkbox filter value or custom filter | `Object` which represents the table state, same to `load-data`'s parameter |


```html
/*vue*/
<desc>
* init the table by yourself
* update the table by listening event `query-info`
</desc>
<template>
  <data-tables-server
    :data='data'
    :total='total'
    :loading='loading'
    :checkbox-filter-def="checkboxFilterDef"
    @query-change='queryChange'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
      sortable="custom"/>
  </data-tables-server>
</template>

<script>
// fake server
let serverData = []
for (let i = 0; i < 1000; i++) {
  serverData.push({
    'content': 'Lock broken' + i,
    'flow_no': 'FW20160101000' + i,
    'flow_type': i % 2 === 0 ? 'Repair' : 'Help',
    'flow_type_code': i % 2 === 0 ? 'repair' : 'help',
  })
}

let mockServer = function(res) {
  let datas = serverData.slice()
  let allKeys = Object.keys(data[0])

  // do filter
  res.filters && res.filters.forEach(filter => {
    datas = datas.filter(data => {
      let props = filter.props || allKeys
      return props.some(prop => {
        if (!filter.vals || filter.vals.length === 0) {
          return true
        }
        return filter.vals.some(val => {
           return data[prop].toString().toLowerCase().indexOf(val.toLowerCase()) > -1
        })
      })
    })
  })

  // do sort
  if (res.sortInfo && res.sortInfo.order) {
    let order = res.sortInfo.order
    let prop = res.sortInfo.prop
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

let i = 1

// fake http
function http(res, time = 200) {
  return new Promise((resolve, reject) => {
    setTimeout(_ => {
      i++ % 5 !== 0
        ? resolve(mockServer(res))
        : reject('network error')
    }, time)
  })
}

export default {
  data() {
    return {
      data: [],
      titles,
      total: 0,
      loading: false,
      checkboxFilterDef: {
        props: 'flow_type_code',
        def: [{
          'code': 'repair',
          'name': 'Repair'
        }, {
          'code': 'help',
          'name': 'Help'
        }]
      }
    }
  },
  created() {
    this.loadData({
      page: 1,
      pageSize: 20
    })
  },
  methods: {
    loadData(info) {
      this.loading = true
      http(info, 1000)
        .then(data => {
          this.data = data.data
          this.total = data.total
          this.loading = false
        })
        .catch(error => {
          this.loading = false
        })
    },
    queryChange(info) {
      this.loadData(info)
    }
  }
}
</script>
```

