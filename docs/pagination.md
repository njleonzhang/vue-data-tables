# Pagination
> customize pagination

`pagination-def` can be leveraged to define pagination.


```html
/*vue*/
<desc>
define item count of each page to 1, pageSize options is [1, 2, 3], default page is 2
</desc>
<template>
  <data-tables :data="data" :pagination-def="paginationDef">
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
      sortable="custom"/>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      paginationDef: {
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      }
    }
  }
}
</script>
```


# Related properties

`data-tables` property

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| pagination-def  | customize pagination | Object | - |

`pagination-def` object property

| Property   | Desc    | Type | Accepted Values | Default value |
| ------------- | ------------- | --- | --- |
| pageSize  | item count of each page | Number | - | 20 |
| pageSizes  | options of item count per page	 | Array of Number | - | [20, 50, 100] |
| currentPage  | current page | Number | - | 1 |
| layout  | layout of Pagination, elements separated with a comma | Number | sizes, prev, pager, next, jumper, ->, total, slot | 'prev, pager, next, jumper, ->, total' |
