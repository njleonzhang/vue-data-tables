# sort
> sort the all data passed by `data`

To leverage this feature,  property `sortable` of `el-table-column` must be set as `custom`.

> if sortable = "custom" is not set, it also work, but the table will be sort by both el-table and vue-data-table, which may cause performance issue.

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

# customize sort function
`sort-method` can be leveraged to define sort function

```html
/*vue*/
<template>
  <data-tables
    :data='data'
    :table-props='tableProps'
    :sort-method='sortMethod'>
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
  },
  methods: {
    sortMethod(a, b) {
      // for Chinese
      let collator = new Intl.Collator(['zh-Hans-CN', 'zh-CN'])
      let flag = a - b
      return Number.isNaN(flag) ? collator.compare(a, b) : flag
    }
  },
  created() {
    this.data = [{
      "content": "王小虎",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    },
    {
      "content": "李小虎",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    },
    {
      "content": "罗小虎",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    },
    {
      "content": "张小虎",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    }]
  }
}
</script>
```
# Related properties

`data-tables` property

| Property   | Desc    | Type | Default value |
| ------------- | ------------- | --- | --- |
| sort-method  | customize sort function | Function | `(a, b) => a > b ? 1 : a < b ? -1 : 0` |
