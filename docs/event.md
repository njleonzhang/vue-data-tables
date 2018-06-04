# 事件

内置 `el-table` 和 `el-pagination` 的事件都全部通过监听 `vue-data-table` 来捕获。以下几个事件是例外的。

## current-change

`el-table` 和 `el-pagination` 都会发射 current-change 事件。 为了让用户可以区分这2种事件，我们在版本 **3.1.3** 以后, 把 `el-pagination` 的 current-change 事件重命名成了 `current-page-change`.

下例中，我们对 `el-table` 的 current-page , `el-pagination` 的 current-change, prev-click, size-change 几个事件进行了监听。请分别通过以下动作来尝试：
  * el-table current-page: 选中列表中的某一列
  * el-pagination current-page: 改变当前页
  * prev-click 点击分页组件的向前键
  * size-change 改变分页组件的每页数量

```html
/*vue*/
<template>
  <data-tables
    :data="data"
    @current-page-change='handleCurrentPageChange'
    @current-change='handleCurrentChange'
    @prev-click='handlePrevClick'
    @size-change='handleSizeChange'
    :pagination-props='{ pageSizes: [5, 10, 15] }'
  >
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
    }
  }
}
</script>
```

# filtered-data
`data-tables` 组件才有的事件，当过滤条件变化时发射，其 payload 是过滤后的数据。

下例中，我们使用 [json2csv](https://github.com/zemirco/json2csv) 将完整的数据和过滤后的值导出。

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
