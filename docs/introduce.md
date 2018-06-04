# Introduce

`vue-data-tables` is compose of the following 3 parts:

* Action Bar
* Table
  * Content
  * Column action
* Pagination

![](../_media/table parts.png)

## Action Bar
Action Bar is entirely created by users. Most of the time, Action Bar can be dependent to `vue-data-tables`, but if needed, we can insert it into `vue-data-tables` by a [slot](https://cn.vuejs.org/v2/guide/components-slots.html#%E5%85%B7%E5%90%8D%E6%8F%92%E6%A7%BD) named `tool-bar`. Refer to the <a href="/#/actionBar">Action Bar</a> section for more details.

## Table
A embedded [el-table](http://element.eleme.io/#/component/table). If you are not familiar to [el-table](http://element.eleme.io/#/component/table), please read its document。

### Content
Show the data

### Action Column
A embedded [el-table-column](http://element.eleme.io/#/en-US/component/table) for quick creating column actions. Refer to the <a href="/#/actionCol">Action Column</a> section for more details.

## Pagination
A embedded [el-pagination](http://element.eleme.io/#/zh-CN/component/pagination). If you are not familiar to [el-pagination](http://element.eleme.io/#/zh-CN/component/pagination), please read its document。For usage in `vue-data-tables`, refer to the <a href="/#/pagination">Pagination</a> section.
