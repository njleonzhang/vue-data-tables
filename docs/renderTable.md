# Render a table
> render a table from data

# Basic table

Use `data` property to define the data source, add `el-table-column` inside tag `data-tables` to add the column. In fact, it is same to [el-table](http://element.eleme.io/#/en-US/component/table)

```html
/*vue*/
<template>
  <data-tables :data='data'>
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
    }
  }
}
</script>
```

# el-table table property
All `el-table` [priperties](http://element.eleme.io/#/en-US/component/table#table-attributes) can be used by property `tableProps`

```html
/*vue*/
<desc>
  By `tableProps`, we indicate that this table should not have border and stripe style, at the same time, should default sorted by `flow NO.`.
</desc>
<template>
  <data-tables :data='data'
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
        border: false,
        stripe: false,
        defaultSort: {
          prop: 'flow_no',
          order: 'descending'
        }
      }
    }
  }
}
</script>
```
# el-table table slot
Same as [el-table](http://element.eleme.io/#/en-US/component/table#table-slot) table slot

| Name | Description |
|------|--------|
| append | Contents to be inserted after the last row. It is still nested inside the `<tbody>` tag. You may need this slot if you want to implement infinite scroll for the table. This slot will be displayed above the summary row if there is one. |

```html
/*vue*/
<template>
  <data-tables :data='data'
    :table-props='tableProps'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
    <p slot="append">table slot</p>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      tableProps: {
        border: false,
        stripe: false,
        defaultSort: {
          prop: 'flow_no',
          order: 'descending'
        }
      }
    }
  }
}
</script>
```

# Related properties

`data-tables` property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| data | The data array which will be render in the table. | Array | - |
| table-props | an object to pass any [proptery](http://element.eleme.io/#/en-US/component/table#table-attributes) to embed el-table. | Object | - |
