# [vue-data-tables](https://github.com/njleonzhang/vue-data-tables/)

> A simple, customizable and pageable table, based on vue2 and element-ui.

`vue-data-tables` is based on [element-ui](http://element.eleme.io/), and depends on the following [element-ui](http://element.eleme.io/) components:

* el-table
* el-table-column
* el-button
* el-pagination

`vue-data-tables` exports 2 components, `data-tables` and `data-tables-server`.
`data-tables` applies to the scenarios, where the amount of data（for examples, 500) is small, so that we can load all data from server to frontend, or even hard code data in front-end code.
`data-tables-server` applies to the other scenarios, where the amount of data is big, we can only load part data, and the pagination and filter are handled by back-end server.

> In later sections, `vue-data-tables` means `data-tables` or `data-tables-server`
