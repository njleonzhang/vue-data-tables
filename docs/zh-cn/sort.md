# 排序功能

本库的排序功能是基于 `el-table` 的[自定义排序](http://element.eleme.io/#/zh-CN/component/table#pai-xu)实现的, 设置 `el-table-column` 的 `sortable` 属性为 `custom`，即可启用那个列的自定义排序。

> 注意虽然把 `sortable` 属性为 `true` 也可以工作，但是此时 `vue-data-table` 和内置的 `el-table` 都会对数据进行排序，会影响表格的性能。


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

## 默认排序

如[前文](zh-cn/basic.md?id=传递-prop-给内置的-el-table)提到的，我们可以通过 `el-table` 的 `default-sort` 属性来设置默认的排序列和方向。对于 `vue-data-tables` 来说所有的内置 `el-table` 的属性，都可以通过 [table-props](zh-cn/basic.md?id=传递-prop-给内置的-el-table) 来传递，所以我们可以通过 `:table-props='{ defaultSort: VALUE }'`, 来为  `vue-data-tables` 定义默认排序。

```html
/*vue*/
<desc>
* `sortable="custom"` 很重要
* `tableProps.defaultSort` 定义了默认的排序列
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

## data-tables 的排序原理
当选择对某一个列进行排序时，`data-tables` 会利用[Array.prototype.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), 并根据这一列对应的 prop 属性来对表格数据进行排序，默认的排序算法为：

```
(a, b) => a > b
  ? 1
  : a < b
    ? -1
    : 0
```

下例中，表格里的数据有3个属性：`flow_no`, `content`, `flow_type`, 对应着表格的3列。此时如果我们对表格的第一列做升序排序，则`data-tables`会对数据以的 `flow_no` 属性的值通过 [Array.prototype.sort](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) 函数，使用上面的默认排序算法进行排序。

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

## data-tables 自定义排序函数
有时候默认的排序函数并不符合你的需求，测试可以通过 `sort-method` 为 `data-tables` 传入自定义的排序函数。
sort-method传入数据格式如下：

```
type sortFn = (any, any) => number

{
  [prop: string]: sorFn
}
```

`prop` 是需要自定义排序的属性，`sortFn` 是该属性对应的排序函数。对于没有定义在这个对象的属性，则使用默认的排序函数。

下例中，我们为 `content` 属性定义了自定义排序函数，从而处理中文排序。

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

## data-tables-server 的排序
本质上，`data-tables-server` 并不参与数据的排序工作。数据均来自于后台, 排序也只能发生在后台。`data-tables-server` 只是需要在排序规则变化时，把排序规则发给后台。

在排序条件变化的时，`data-tables-server` 发射一个类型为 `sort` 的 `query-change` 事件，外层组件需要监听该事件，并把向服务器发送请求来获取数据。

`query-info` 事件发射的数据的 `sort` 字段的值包含了排序的信息，其结构如下：

```
{
  order: 'ascending' | 'descending',    // 排序方向
  prop: String                          // 排序字段
}
```

下例展示了如何通过监听 query-info 事件来处理排序：

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
