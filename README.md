# vue-data-tables

> vue2.0 DataTables, based on element-ui, el-table + el-pagination + custom filter and sort


![preview](https://rawgit.com/njleonzhang/vue-data-tables/master/Assets/desc.png)

## Online demo
* [Demo](https://njleonzhang.github.io/vue-data-tables/)

* [Demo Code](https://github.com/njleonzhang/vue-data-tables/tree/master/example/docs)


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

    If you don't want import the whole `element-ui`, you can just load corresponding components refer to `On demand` section of [element-ui doc](http://element.eleme.io/#/en-US/component/quickstart)

    This lib depends on the following components:
    - el-table
    - el-table-column
    - el-row
    - el-col
    - el-input
    - el-button
    - el-pagination
    - el-checkbox
    - el-checkbox-group


2. use in your project.

    ```html
    <template>
      <data-tables
        :data='tableData',    
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
<table>
  <tr>
    <th>Property</th>
    <th>Layer1 sub proptery</th>
    <th>Layer2 sub proptery</th>
    <th>Desc</th>
    <th>Type</th>
    <th>Default values</th>
  </tr>
  <tr>
    <td>data</td>
    <td></td>
    <td></td>
    <td>The data array which will be render in the table.</td>
    <td>Array</td>
    <td>-</td>
  </tr>
  <tr>
    <td>tableProps</td>
    <td></td>
    <td></td>
    <td>An object to properties to el-table. refer to <a href="http://element.eleme.io/#/en-US/component/table#table-attributes">el-table proptery</a></td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>col-not-row-click</td>
    <td></td>
    <td></td>
    <td>indicated column[s] which can not trigger row click</td>
    <td>String | Array</td>
    <td>the action column</td>
  </tr>
  <tr>
    <td>actions-def</td>
    <td></td>
    <td></td>
    <td>Define the actions, which belongs to table.</td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td rowspan="6"></td>
    <td>colProps</td>
    <td></td>
    <td>Actions bar, checkbox and searchbox are in a <b>el-row</b> as <b>el-col</b>s.
            An object to properties to el-col. refer to <a href="http://element.eleme.io/#/en-US/component/layout#col-attributes">el-col proptery</a>
    </td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>def</td>
    <td></td>
    <td>Define the actions</td>
    <td>Array</td>
    <td>[]</td>
  </tr>
  <tr>
    <td rowspan="4"></td>
    <td>name</td>
    <td>the ation button label text</td>
    <td>String</td>
    <td>-</td>
  </tr>
  <tr>
    <td>icon</td>
    <td>icon of the button</td>
    <td>String</td>
    <td>-</td>
  </tr>
  <tr>
    <td>buttonProps</td>
    <td>An object to properties to el-button. refer to <a href="http://element.eleme.io/#/en-US/component/button#attributes">el-button proptery</a></td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>handler</td>
    <td>handler of the click</td>
    <td>Function</td>
    <td>-</td>
  </tr>
  <tr>
    <td>checkbox-filter-def</td>
    <td></td>
    <td></td>
    <td>Define the checkbox filter</td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td rowspan="6"></td>
    <td>colProps</td>
    <td></td>
    <td>Actions bar, checkbox and searchbox are in a <b>el-row</b> as <b>el-col</b>s
            An object to properties to el-col. refer to <a href="http://element.eleme.io/#/en-US/component/layout#col-attributes">el-col proptery</a>
    </td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>props</td>
    <td></td>
    <td>Indicate proptery[s] in the data which will be used to filter data by checkbox filter.</td>
    <td>String | Array</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>filterFunction</td>
    <td></td>
    <td>customize filter function</td>
    <td>Function</td>
    <td>-</td>
  </tr>
  <tr>
    <td>def</td>
    <td></td>
    <td>grid offset of checkbox</td>
    <td>Array</td>
    <td>[]</td>
  </tr>
  <tr>
    <td rowspan="2"></td>
    <td>name</td>
    <td>the checkbox label text</td>
    <td>String</td>
    <td>-</td>
  </tr>
  <tr>
    <td>code</td>
    <td>the value of this checkbox stands for</td>
    <td>String</td>
    <td>-</td>
  </tr>
  <tr>
    <td>search-def</td>
    <td></td>
    <td></td>
    <td>Define the search box</td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td rowspan="5"></td>
    <td>show</td>
    <td></td>
    <td>show or hide search box</td>
    <td>Boolean</td>
    <td>true</td>
  </tr>
  <tr>
    <td>colProps</td>
    <td></td>
    <td>Actions bar, checkbox and searchbox are in a <b>el-row</b> as <b>el-col</b>s
            An object to properties to el-col. refer to <a href="http://element.eleme.io/#/en-US/component/layout#col-attributes">el-col proptery</a>
    </td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>props</td>
    <td></td>
    <td>indicate proptery[s] in the data which will be used to filter data by search box.</td>
    <td>Array | String</td>
    <td>All</td>
  </tr>
  <tr>
    <td>filterFunction</td>
    <td></td>
    <td>customize filter function</td>
    <td>Function</td>
    <td>-</td>
  </tr>
  <tr>
    <td>inputProps</td>
    <td></td>
    <td>An object to properties to el-input. refer to <a href="http://element.eleme.io/#/en-US/component/input#input-attributes">el-input proptery</a></td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td rowspan="8">actionColDef</td>
    <td></td>
    <td></td>
    <td>Define action column</td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>show</td>
    <td></td>
    <td>Determine wether show action column</td>
    <td>Boolean</td>
    <td>true</td>
  </tr>
  <tr>
    <td>tableColProps</td>
    <td></td>
    <td>An object to pass properties to el-table-column. refer to <a href="http://element.eleme.io/#/en-US/component/table#table-column-attributes">el-button proptery</a></td>
    <td>Object</td>
    <td>-  </td>
  </tr>
  <tr>
    <td rowspan="5">def</td>
    <td></td>
    <td>Define the actions, which belongs to row</td>
    <td>Array</td>
    <td>[]</td>
  </tr>
  <tr>
    <td>name</td>
    <td>the row action button text</td>
    <td>String</td>
    <td>-</td>
  </tr>
  <tr>
    <td>type</td>
    <td>type of the button</td>
    <td>String</td>
    <td>text</td>
  </tr>
  <tr>
    <td>buttonProps</td>
    <td>An object to properties to el-button. refer to <a href="http://element.eleme.io/#/en-US/component/button#attributes">el-button proptery</a></td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td>handler</td>
    <td>handler of the click</td>
    <td>Function</td>
    <td>-</td>
  </tr>
  <tr>
    <td>pagination-def</td>
    <td></td>
    <td></td>
    <td>define pagination.</td>
    <td>Object</td>
    <td>-</td>
  </tr>
  <tr>
    <td rowspan="4"></td>
    <td>layout</td>
    <td></td>
    <td>refer to <a href="http://element.eleme.io/#/en-US/component/pagination">Elmeme Doc</a></td>
    <td>String</td>
    <td>[prev, pager, next, jumper, sizes, total]</td>
  </tr>
  <tr>
    <td>pageSize</td>
    <td></td>
    <td>refer to <a href="http://element.eleme.io/#/en-US/component/pagination">Elmeme Doc</a></td>
    <td>Number</td>
    <td>20</td>
  </tr>
  <tr>
    <td>pageSizes</td>
    <td></td>
    <td>refer to <a href="http://element.eleme.io/#/en-US/component/pagination">Elmeme Doc</a></td>
    <td>Array</td>
    <td>[20, 50, 100]</td>
  </tr>
  <tr>
    <td>currentPage</td>
    <td></td>
    <td>refer to <a href="http://element.eleme.io/#/en-US/component/pagination">Elmeme Doc</a></td>
    <td>Number</td>
    <td>1</td>
  </tr>
</table>

For details, check the [Demo](https://njleonzhang.github.io/vue-data-tables/) and [Demo Code](https://github.com/njleonzhang/vue-data-tables/tree/master/example/docs).

## Event
| Event          | Desc            |  params |
| ---- | ---- | ---- |
| row-click | Emit when row is clicked | row, event, column |
| selection-change | Emit when selection is changed | currentRow, oldCurrentRow |
| select | Emit when row is selected | selection |
| select-all | Emit when select-all is clicked | selection |
| filtered-data | Emit when filter condition changes | filteredData |

For details, check the [Demo](https://njleonzhang.github.io/vue-data-tables/) and [Demo Code](https://github.com/njleonzhang/vue-data-tables/tree/master/example/docs).

## Dev

``` bash
# install dependencies
npm install

# serve test/play with hot reload at localhost:8080
npm run play

# serve docs with hot reload at localhost:8080
npm run dev
```
