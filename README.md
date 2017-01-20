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

## Attributes
| Property          | Desc            | Type            |  default values |
|-------------  |---------------- |---------------------- | ----- |
| data | The data array which will be render in the table.| Array | - |
| actions-def | Define the table actions. | Object | `{ def: [], width: 5, offset: 0 }` |
| checkbox-filter-def | Define checkbox filter | Object | `{ props: undefined, def: [], width: 14, offset: 0, filterFunction: undefined}` |
| row-action-def | Define actions of every row | Object |
| search-def | Define search bar | Object | `{show: true, props: undefined, filterFunction: undefined, width: 5, offset: 0}` |
| action-col-width | Define min width of action column  | Object | - |
| has-action-col | Determine wether show action column | Boolean | true |
| col-not-row-click | Indicate the columns which do not trigger row-click | Array | the action column |

## Event
| Event          | Desc            |
| ---- | ---- |
| row-click | Emit when row is clicked |

For details, check the [example](https://github.com/njleonzhang/vue-data-tables/blob/master/example/App.vue).

## Dev

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
```
