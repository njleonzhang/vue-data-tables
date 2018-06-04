# [vue-data-tables](https://github.com/njleonzhang/vue-data-tables/)

> A simple, customizable and pageable table, based on vue2 and element-ui.

本库是基于[element-ui](http://element.eleme.io/)的封装，依赖于以下的[element-ui](http://element.eleme.io/)组件:

* el-table
* el-table-column
* el-button
* el-pagination

本库导出了2个组件 `data-tables` 和 `data-tables-server`. 在一些业务场景中，数据量并不大（比如500条数据），可以把所有数据加载到前台，甚至于直接写在前台代码里，此时数据分页和过滤均发生在前台，`data-tables` 适用于这种场景。在另外的业务场景中，数据量很大，不可能一次性的返回给前台，此时数据分页和过滤均发生在后台，`data-tables-server` 则适用于这种场景。

> 在后文中，如果提到组件 `vue-data-tables`，则指的是 `data-tables` 或者 `data-tables-server`.
