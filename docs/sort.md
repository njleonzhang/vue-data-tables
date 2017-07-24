# sort
> sort the all data passed by `data`

To leverage this feature,  property `sortable` of `el-table-column` must be set as `custom`.

> if sortable = "custom" is nt set, it also work, but the table will be sort by both el-table and vue-data-table, which may cause performance issue.

```html
/*vue*/
<desc>
* `sortable="custom"` is important.
* `tableProps.defaultSort` indicate default sort column and order
</desc>
<template>
  <data-tables
    :data='data'
    :table-props='tableProps'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      tableProps: {
        defaultSort: {
          prop: 'flow_type',
          order: 'descending'
        }
      }
    }
  }
}
</script>
```
