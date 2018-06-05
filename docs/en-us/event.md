# Event

## Event proxy
`vue-data-tables` is proxy for all events of [el-table](http://element.eleme.io/#/en-US/component/table) and [el-pagination](http://element.eleme.io/#/en-US/component/pagination). except `current-page`, all other events are emitted by `vue-data-tables` with same name and payload.

`el-table` and `el-pagination` both emit event `current-change` (same name, payload is totally different). To distinguish these 2 events, we rename `current-change` of `el-pagination` to `current-page-change` after version **3.1.3**.

In the following sample, we listen on event `current-page` of `el-table`, `current-change`, `prev-click`, `size-change` of `el-pagination`. perform the following actions to try the event listening.

| Action | Event | Original Component |
| -- | -- | -- |
| click a row | current-page | el-table |
| select a row with the checkbox | selection-change | el-table |
| change current page | current-page | el-pagination |
| click the previous page button on the el-pagination | prev-click | el-pagination |
| change the item count of each page | size-change | el-pagination |

```html
/*vue*/
<template>
  <data-tables
    :data="data"
    @current-page-change='handleCurrentPageChange'
    @current-change='handleCurrentChange'
    @prev-click='handlePrevClick'
    @size-change='handleSizeChange'
    @selection-change='handleSelectionChange'
    :pagination-props='{ pageSizes: [5, 10, 15] }'
  >
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>

    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
    />
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data: [...new Array(30)].reduce((previous) => {
        return previous.concat(data)
      }, []),
      titles
    }
  },
  methods: {
    handleCurrentPageChange(page) {
      this.$notify({
        message: `pagination current-change: ${page}`
      })
    },
    handleCurrentChange(currentRow) {
      this.$notify({
        message: `el-table current-change: ${currentRow.flow_no}`
      })
    },
    handlePrevClick(page) {
      this.$notify({
        message: `prev-click: ${page}`
      })
    },
    handleSizeChange(size) {
      this.$notify({
        message: `size-change: ${size}`
      })
    },
    handleSelectionChange(val) {
      this.$notify({
        message: `selection-change: ${val.map(row => row.flow_no).join(',')}`
      })
    }
  }
}
</script>
```

# filtered-data
Only `data-tables` can emit this event. it emits when `filter item` changes with filtered data as payload.

In the following example, we leverage [json2csv](https://github.com/zemirco/json2csv) to export entire data set and filtered data set.

```html
/*vue*/
/*jsResource //unpkg.com/json2csv@3.9.1/dist/json2csv.js*/
<desc>
export data to excel
</desc>
<template>
  <div>
    <div style='margin-bottom: 10px;'>
      <el-button @click='exportAll' style='margin-right: 10px;'>export all</el-button>
      <el-button @click='exportFiltered'>export filtered</el-button>

      <el-input style='width: 200px; margin-left: 20px;' v-model='filters[0].value'></el-input>
    </div>

    <data-tables
      :data='data'
      :filters='filters'
      @filtered-data='handleFilteredData'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label">
      </el-table-column>
    </data-tables>
  </div>
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
      filters: [{
        value: ''
      }],
      filteredData: [],
      columns: ['flow_no', 'content', 'flow_type'],
      columnNames: ['Flow NO.', 'Content', 'type']
    }
  },
  methods: {
    exportAll() {
      CsvExport(this.data, this.columns, this.columnNames, 'all')
    },
    exportFiltered() {
      CsvExport(this.filteredData, this.columns, this.columnNames, 'filtered')
    },
    handleFilteredData(filteredData) {
      this.filteredData = filteredData
    }
  }
}
</script>
```
