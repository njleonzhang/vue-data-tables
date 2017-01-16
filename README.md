# vue-data-tables

> vue2.0 DataTables, based on element-ui, el-table + el-pagination + custom filter and sort


![preview](https://github.com/njleonzhang/vue-data-tables/blob/master/Assets/desc.png)

## example
Check the [example](https://github.com/njleonzhang/vue-data-tables/blob/master/example/App.vue).

## Install ElementUI and vue-data-tables
`npm install element-ui`

`npm install vue-data-tables`

## Usage
1. import to your project as plugin.

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import DataTables from 'vue-data-tables'

Vue.use(ElementUI)
Vue.use(DataTables)
```

2. use in your project.
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

  define the tool bar.

3. rowActionsDef

  define the actions for every row.

## Event
`row-click`: emit when row is clicked

For details, check the [example](https://github.com/njleonzhang/vue-data-tables/blob/master/example/App.vue).

## Dev

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
