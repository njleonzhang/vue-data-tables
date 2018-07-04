# Sort

`sort` feature of `vue-data-tables` is based on the [customize sort](http://element.eleme.io/#/en-US/component/table#sorting) of `el-table`. Setting `sortable` prop of `el-table-column` to `custom` can enable customize sort of the column.

> PS: Setting `sortable` to `true` can also work, but `vue-data-table` and embedded `el-table` both sort the data, which may cause performance downgrade.

```html
/*vue*/
<desc>
* `sortable="custom"` 很重要
* `tableProps.defaultSort` 定义了默认的排序列
</desc>
<template>
  <data-tables
    :data='data'
  >
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

## Default sort
As mentioned in [previous section](en-us/basic.md?id=pass-props-to-the-embedded-el-table), `el-table` accepts `default-sort` prop to set default sort column and order. `vue-data-tables` can pass any props to embedded `el-table` by prop [table-props](en-us/basic.md?id=pass-props-to-the-embedded-el-table), so we can define `vue-data-tables`'s default sort by `:table-props='{ defaultSort: VALUE }'`.

```html
/*vue*/
<desc>
* `sortable="custom"` important
* `tableProps.defaultSort` default the default sort
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

## Principle of data-tables' sort
When a column is selected to sort, `data-tables` sorts the data according the prop of the column with [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), the default sort function is:

```
(a, b) => a > b
  ? 1
  : a < b
    ? -1
    : 0
```

In the following example, the data have 3 properties, `flow_no`, `content` and `flow_type`, corresponding to the 3 column of the table. If we sort the table with 1st column, `data-tables` will sort the table using [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) with the default sort function and data `row['flow_no']`.

```html
/*vue*/
<template>
  <data-tables
    :data='data'>
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
  },
  created() {
    this.data = [{
      "content": "help me",
      "flow_no": "FW201601010002",
      "flow_type": "Help",
    },
    {
      "content": "repair TV",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    },
    {
      "content": "help you",
      "flow_no": "FW201601010004",
      "flow_type": "Help",
    },
    {
      "content": "repair fan",
      "flow_no": "FW201601010003",
      "flow_type": "Repair",
    }]
  }
}
</script>
```

## Customize sort function for data-tables
Prop `sort-method` of `data-tables` can be leveraged to define the sort function.

Value passed to `sort-method` should follow the following format:

```
type sortFn = (any, any) => number

{
  [prop: string]: sorFn
}
```

`prop` represents the property which need customize sort，`sortFn` is the sort function for the property. For the properties not defined in this object, `vue-data-tables` use the default sort function.

In the following example, we define a customize function for property `content` to handle Chinese string sort.

```html
/*vue*/
<template>
  <data-tables
    :data='data'
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
      sortMethod: {
        content(a, b) {
          // for Chinese
          console.log('custom sort funtion is called: ', a, b)
          let collator = new Intl.Collator(['zh-Hans-CN', 'zh-CN'])
          let flag = a - b
          return Number.isNaN(flag) ? collator.compare(a, b) : flag
        }
      }
    }
  },
  created() {
    this.data = [{
      "content": "王小虎",
      "flow_no": "FW201601010002",
      "flow_type": "Repair",
    },
    {
      "content": "李小虎",
      "flow_no": "FW201601010001",
      "flow_type": "Repair",
    },
    {
      "content": "罗小虎",
      "flow_no": "FW201601010004",
      "flow_type": "Repair",
    },
    {
      "content": "张小虎",
      "flow_no": "FW201601010003",
      "flow_type": "Repair",
    }]
  }
}
</script>
```

## Sort of data-tables-server

In essence, `data-tables-server` doesn't take charge the data sort. Only the back-end server have the entire data set, so the `sort` can also be handled by back-end server. What `data-tables-server` need to do is emitting the `sort condition` when the condition changes, so that the back-end server can sort and return new data according to the condition.

When the sort condition changes, `data-tables-server` emits a event named `query-change` with type `sort`.

The payload of `query-info` event has a `sort` property, whose format is:

```
{
  order: 'ascending' | 'descending',    // sort order
  prop: String                          // sort prop
}
```

Example to demonstrate how to handle `query-info` for sort.


```html
/*vue*/
<template>
  <data-tables-server
    :data='data'
    :total='total'
    @query-change='loadData'
    :pagination-props='{ pageSizes: [5, 10, 15] }'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.label"
      sortable="custom">
    </el-table-column>
  </data-tables-server>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      total: 0,
    }
  },
  methods: {
    async loadData(queryInfo) {
      queryInfo.type === 'sort' && this.$message(`prop: ${queryInfo.sort.prop}, order: ${queryInfo.sort.order}`)
      let { data, total } = await http(queryInfo)
      this.data = data
      this.total = total
    }
  }
}
</script>
```
