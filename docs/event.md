# Event

All `el-table` [events](http://element.eleme.io/#/en-US/component/table#table-events) and all `el-pagination` [events](http://element.eleme.io/#/en-US/component/pagination#events) have been proxied by `vue-data-tables`

# row-click and cell-click

`row-click` and `cell-click` are treated differently(not a simple proxy).
SomeTimes, `row-click` and `cell-click` may not want to be triggered, when some columns are clicked. For example, In `table action column`, there may be lots of buttons. when you click these buttons, you often click the `td` element, which will trigger `row-click` and `cell-click` event. property `col-not-row-click` can be leveraged to indicate the columns, which you don't want them to trigger `row-click` and `cell-click`.

> `table action column` is marked as `can not trigger click` by deault.

```html
/*vue*/
/*jsResource //unpkg.com/json2csv@3.9.1/dist/json2csv.js*/
<desc>
`flow_no` and `table action column`(default) are marked as `can not trigger click`
</desc>
<template>
  <data-tables
    :data='data'
    :col-not-row-click="canNotClickList"
    :action-col-def="actionColDef"
    @row-click='handleRowClick'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      canNotClickList: ['flow_no'],
      actionColDef: {
        label: 'Actions',
        def: [{
          handler: row => {
            this.$message('Edit clicked')
            row.flow_no = "hello word"
          },
          name: 'Edit'
        }]
      }
    }
  },
  methods: {
    handleRowClick(row, event, column) {
      this.$message(`${row.flow_no} is clicked`)
      console.log(row, event, column)
    }
  }
}
</script>
```

# filtered-data
trigger when any filter change(search box, checkbox, sort or customFilters), and pass filted data out.

> Combined with 3rd-party library, such as: [json2csv](https://github.com/zemirco/json2csv) and [alasql](https://github.com/agershun/alasql), filtered data can be exported.

```html
/*vue*/
/*jsResource //unpkg.com/json2csv@3.9.1/dist/json2csv.js*/
<desc>
export data to excel
</desc>
<template>
  <data-tables
    :data='data'
    :actions-def='actionsDef'
    @filtered-data='handleFilteredData'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
let CsvExport = function(data, fields, fieldNames, fileName) {
  try {
    var result = json2csv({
      data: data,
      fields: fields,
      fieldNames: fieldNames
    })
    var csvContent = 'data:text/csvcharset=GBK,\uFEFF' + result
    var encodedUri = encodeURI(csvContent)
    var link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${(fileName || 'file')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error(err)
  }
}

export default {
  data() {
    return {
      data,
      titles,
      canNotClickList: ['flow_no'],
      actionsDef: [],
      filteredData: []
    }
  },
  created() {
    let columns = ['flow_no', 'content', 'flow_type']
    let columnNames = ['Flow NO.', 'Content', 'type']
    this.actionsDef = {
      colProps: {
        span: 19
      },
      def: [{
        name: 'export all',
        handler: () => {
          CsvExport(this.data, columns, columnNames, 'all')
        },
        icon: 'plus'
      }, {
        name: 'export filtered',
        handler: () => {
          CsvExport(this.filteredData, columns, columnNames, 'filtered')
        },
        icon: 'upload'
      }]
    }
  },
  methods: {
    handleFilteredData(filteredData) {
      this.filteredData = filteredData
    }
  }
}
</script>
```
