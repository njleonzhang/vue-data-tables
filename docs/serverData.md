# server-side data source (Load massive data)
In the previous section, we always fetch all data from the server with a single http request. But sometimes,
you may have massive data on the sever and it's impossible to load all that data to the web page. In this
scenario, the component `DataTablesServer` can be used.

`DataTablesServer` basically has the same features to `DataTables`, which means you also have a customizable
action bar, action columns, pagination and so on.

> When you use `DataTables`, you may provide `filterFunction` for some props to define special filter logic.
For `DataTablesServer` `filterFunction` doesn't work, because the filter is not made on the front-end but on the server-side when you use `DataTablesServer`.


## import DataTablesServer to your project

```
import { DataTablesServer } from 'vue-data-tables'
Vue.use(DataTablesServer)
```

## working mode

`DataTablesServer` can be used in two modes: `auto loading mode` and `free mode`.
In both modes, you must provide the following props:

 | Property | Desc | Type | Default value |
 | -- | -- | -- | -- |
 | data | The data array which will be render in the table. | Array | - |
 | total | count of data in server side | number | - |

### auto loading mode

 In this mode, `DataTablesServer` helps to show and hide `loading` along with Http requests.
 Provide property `load-data` to enable this mode.

 | Property | Desc | Type | Parameter | Return value |
 | -- | -- | -- | -- | -- |
 | load-data | The function called by `DataTablesServer` to load data when the table is initializing or any changes happens on page, page size, search value, checkbox filter value or custom filter  | Function | `Object` which represents the table state | must return a `Promise` instance |


 properties of load-data parameter

 | Property | Desc | Type | format | possible value |
 | - | - | - | - | - |
 | type | indicate why the loadData function called | String | - | 'init'<br>'sizeChange'<br>'pageChange'<br>'checkBoxChange'<br>'sortChange'<br>'customFilterChange'  |
 | page | current page of the table | number | - | - |
 | pageSize | page size of the table | number | - | - |
 | sortInfo | sort info of the table | Object | {<br>&nbsp;&nbsp;order, <br>&nbsp;&nbsp;prop<br>} | order: 'ascending or descending' |
 | filters | filter info of the table | Array | [{<br>&nbsp;&nbsp;props,<br>&nbsp;&nbsp;vals,<br>&nbsp;&nbsp;type<br>}] | type: 'checkbox', 'search' or [other customize string](https://njleonzhang.github.io/vue-data-tables/#/defineActionBar?id=related-properties) |

```html
/*vue*/
<desc>
* load data and handle the http result both in `load-data`
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

>  Notice: The `load-data` function must return a `Promise` instance, it should be resolved when the http request succeeds,
   and it should be rejected when http request fails.

### free mode
  In this mode, `DataTablesServer` just renders the table according to the property you provide, you need to handle `loading` yourself.
  `auto loading mode` should be enough for most scenarios, but if you want to handle `loading` yourself for some special
  reason, use `free mode`

  To enable this mode, don't provide the `load-data` property, but provide the `loading` property and leverage the `query-change` event.


  | Property | Desc | Type |
  | -- | -- | -- | -- | -- |
  | loading | indicate if `loading` shows. `true` make `loading` shows, `false` make `loading` hides | Boolean  |


 | Event | Desc | Payload |
 | - | - | - |
 | query-change | emit when any changes happen on the page, page size, search value, checkbox filter value or custom filter | `Object` which represents the table state, same as `load-data`'s parameter |


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

