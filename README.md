# vue-data-tables

> vue2.0 DataTables, based on element-ui, el-table + el-pagination + custom filter and sort


![preview](https://github.com/njleonzhang/vue-data-tables/blob/master/Assets/desc.png)

## Install
`npm install vue-data-tables`

## Usage
1. import into your project

```js
<script>
import DataTables from 'vue-data-tables'

export default {
  name: 'app',
  components: {
    DataTables
  }
</script>    
```

```html
<template>
  <data-tables:data='tableData',    
    :tool-bar-def='toolBarDef',
    :row-action-def='rowActionsDef',
    @row-click='rowClick'>
    <el-table-column prop="flow_no"
      label="服务编号"
      sortable="custom">
    </el-table-column>
    <el-table-column
      prop="flow_no"
      label="服务编号"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>
```

## props
1. data
  The data array which will be render in the table.

2. toolBarDef
  Defination on tool bar.

3. rowActionsDef
  Defination on action for every row.

check the [example](https://github.com/njleonzhang/vue-data-tables/blob/master/example/App.vue).

## Event
`row-click`: emit when row is clicked

## Dev

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
