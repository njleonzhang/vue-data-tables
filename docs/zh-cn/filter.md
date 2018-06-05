# 过滤

`vue-data-tables` 接受属性 `filters` 来现实对表格内容的过滤。传入 `filters` 的值是一个列表，其每一项称为一个`过滤项`，格式如下：

```
// 以类似typescript的定义格式描述
[
  {                                        // 一个过滤项
    prop?: String | Array | Undefined;     // 用于指定这个过滤项是针对哪个(些)列的
    value: any;                            // 过滤值
    filterFn?: (row, filter) => Boolean;   // 过滤函数，`data-tables` 用此函数自定义过滤规则
    [key: string]: any;                    // 如果需要，`data-tables-server` 可添加任意属性，
                                           // 用于定制数据更新的 http 请求。
  },
  ...
]
```

filterFn 的第一个参数 row 代表列数据，第二个参数 filter 则是本过滤项。

## data-tables 的过滤原理

`data-tables` 根据 `filters` 传入的`过滤项`列表中的每一个`过滤项`生成一个 [Array.prototype.filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 的过滤函数，并逐项调用 [Array.prototype.filter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 来过滤数据, 其逻辑如下:

![](../_media/filter.svg)

* 如果 value 值是 `[]`, `undefined` 或 `""`, 则不做过滤。
* 如果 filterFn 不存在，那么根据 value 和 prop 的类型, `data-tables` 会构造不同的过滤函数，即图中的F1 ~ F4。
  * prop 是 String, value 不是 Array (`F1`)
  * prop 是 String, value 是 Array (`F2`)
  * prop 是 Array 或 undefined, value 不是 Array (`F3`)
  * prop 是 Array 或 undefined, value 是 Array (`F4`)
* 如果 filterFn 存在的话, 则用 filterFn 来过滤

> 从流程图中可以看出来，`prop 是 undefined` 可以看作是 `prop 是 Array` 的一种特殊情况。

### prop 是 String, value 不是 Array (`F1`)

过滤函数 `F1` 逻辑为:

```
在`参与比较的值`都 string 化 (简单的通过 toString 函数) 并忽略大小写的前提下，
row 的 prop 属性值(row[prop]) 如果包含过滤值(value)，则保留这项。
```

比如下例中，我们对属性 `name` 进行过滤，过滤值为 `us`。那么只有 name 只为 'USA' 的第一条数据会保留在表中。
```html
/*vue*/
<desc>
  把input里的值改为 `us` 尝试下
</desc>
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='6'>
          <el-input v-model='filters[0].value' placeholder='input "us" to try'></el-input>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :filters='filters'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: 'USA', rank: 1 },
        { name: 'China', rank: 2 }
      ],
      titles: [{
        prop: 'name',
        label: 'Name'
      }, {
        prop: 'rank',
        label: 'Rank'
      }],
      filters: [
        {
          prop: 'name',
          value: ''
        }
      ]
    }
  }
}
</script>
```
### prop 是 String, value 是 Array (`F2`)

过滤函数 `F2` 逻辑为:

```
在`参与比较的值`都 string 化 (简单的通过 toString 函数) 并忽略大小写的前提下，
row 的 prop 属性值(row[prop])如果包含多个过滤值(value)中的任意一个，则保留这项。
```
比如下例中，我们对属性 `name` 进行过滤，过滤值为 `us` 和 `china`时，两条数据都会被保留。

```html
/*vue*/
<desc>
  选择 China 和 USA 来尝试下
</desc>
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='6'>
          <el-checkbox-group v-model='filters[0].value'>
            <el-checkbox label='China'></el-checkbox>
            <el-checkbox label='USA'></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :filters='filters'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: 'USA', rank: 1 },
        { name: 'China', rank: 2 }
      ],
      titles: [{
        prop: 'name',
        label: 'Name'
      }, {
        prop: 'rank',
        label: 'Rank'
      }],
      filters: [
        {
          prop: 'name',
          value: []
        }
      ]
    }
  }
}
</script>
```

### prop 是 Array, value 不是 Array (`F3`)

过滤函数 `F3` 逻辑为:

```
在`参与比较的值`都 string 化 (简单的通过 toString 函数) 并忽略大小写的前提下，
row 的 多个 prop 属性值(row[prop])中有一个包含过滤值(value)，则保留这项。
```

比如下例中，我们对属性 `name` 和 `rank` 进行过滤，过滤值为 `us` 或 `1`, 第一条数据会保留在表中。
```html
/*vue*/
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='10'>
          <el-input v-model='filters[0].value' placeholder='input "us" or "1" to try'></el-input>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :filters='filters'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: 'USA', rank: 1 },
        { name: 'China', rank: 2 }
      ],
      titles: [{
        prop: 'name',
        label: 'Name'
      }, {
        prop: 'rank',
        label: 'Rank'
      }],
      filters: [
        {
          prop: ['name', 'rank'],
          value: ''
        }
      ]
    }
  }
}
</script>
```

### prop 是 Array, value 是 Array (`F4`)

> 这个场景似乎令人费解，所以不建议使用，如果没有特别需求，可以跳过这一节。

过滤函数 `F4` 逻辑为:

```
在`参与比较的值`都 string 化 (简单的通过 toString 函数) 并忽略大小写的前提下，
row 的多个 prop 属性值(row[prop])中有一个包含多个过滤值(value)中的任意一个，则保留这项。
```

比如下例中，我们又有2条数据, 我们对属性 `name` 和 `neighbor` 进行过滤，过滤值为 'China' 和 'Canada' 时，两条数据都会被保留。

```html
/*vue*/
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='12'>
          <el-checkbox-group v-model='filters[0].value'>
            <el-checkbox label='China'></el-checkbox>
            <el-checkbox label='USA'></el-checkbox>
            <el-checkbox label='Canada'></el-checkbox>
            <el-checkbox label='Russia'></el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :filters='filters'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
      >
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [
        { name: 'USA', neighbor: 'Canada' },
        { name: 'China', neighbor: 'Russia' }
      ],
      titles: [{
        prop: 'name',
        label: 'Name'
      }, {
        prop: 'neighbor',
        label: 'Neighbor'
      }],
      filters: [
        {
          prop: ['name', 'neighbor'],
          value: []
        }
      ]
    }
  }
}
</script>
```


### prop 是 `undefined`

如上文提到的，`prop 是 undefined` 可以认为是 `prop 是 Array` 的一种特殊情况。

* 如果未设置 `data-tables` 的 `filterProps` 属性， 那么 `prop` 会被赋值为 data 队列里第一个元素的所有的属性。过滤逻辑按 `prop 为一个 Array` 来处理

  比如下例中，我们没有设置过滤项的 prop 值，此时 prop 被自动认为是 `data[0]` 的所有属性，即: name 和 rank。

  ```html
  /*vue*/
  <template>
    <div>
      <div style='margin-bottom: 10px'>
        <el-row>
          <el-col :span='10'>
            <el-input v-model='filters[0].value' placeholder='input "us" or "1" to try'></el-input>
          </el-col>
        </el-row>
      </div>

      <data-tables
        :data='data'
        :filters='filters'>
        <el-table-column v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.prop"
        >
        </el-table-column>
      </data-tables>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        data: [
          { name: 'USA', rank: 1 },
          { name: 'China', rank: 2 }
        ],
        titles: [{
          prop: 'name',
          label: 'Name'
        }, {
          prop: 'rank',
          label: 'Rank'
        }],
        filters: [
          {
            value: ''
          }
        ]
      }
    }
  }
  </script>
  ```

* 有些情况下，我们需要灵活性，不想让 `data-tables` 自动为我们赋值，这时可以使用 `data-tables` 的 `filterProps` 属性来定义缺省的 prop 列表。

  例如下例中，2条数据的 `members` 属性都为 `['USA', 'China']`, 如果我们不设置过滤项的 prop, 然后用 `us` 去过滤，会发现列表不会变化，因为 `members` 也被用于了过滤，所有的列都符合过滤条件。设置 `filterProps` 可以解决这个问题。

  > 当然，我们可以通过为每一个过滤项配置 prop 属性来处理，但是如果有多个过滤项，`filterProps` 来做全局配置会更方便。

  ```html
  /*vue*/
  <desc>
    去选，勾选的 filterProps，来体验区别。
  </desc>
  <template>
    <div>
      <div>
        <el-checkbox v-model='setFilterProps'> filterProps</el-checkbox>
      </div>
      <div style='margin: 10px 0'>
        <el-row align='middle' type='flex' :gutter='20'>
          <el-col :span='10'>
            <el-input v-model='filters[0].value' placeholder='input "us" or "1" to try'></el-input>
          </el-col>

          <el-col :span='10'>
            <el-checkbox-group v-model='filters[1].value'>
              <el-checkbox label='China'></el-checkbox>
              <el-checkbox label='USA'></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>

      <data-tables
        :data='data'
        :filters='filters'
        :filter-props='setFilterProps ? ["name", "rank"] : undefined'>
        <el-table-column v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.prop"
        >
        </el-table-column>
      </data-tables>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        data: [
          { name: 'USA', rank: 1, members: ['USA', 'China'] },
          { name: 'China', rank: 2, members: ['USA', 'China'] }
        ],
        setFilterProps: true,
        titles: [{
          prop: 'name',
          label: 'Name'
        }, {
          prop: 'rank',
          label: 'Rank'
        }, {
          prop: 'members',
          label: 'Members'
        }],
        filters: [
          {
            value: ''
          },
          {
            value: []
          }
        ]
      }
    }
  }
  </script>
  ```

### 使用 filterFn
在一些情况下，默认的比较方式不能满足过滤要求，此时可以使用 filterFn, 来自定义过滤函数。

比如下例中，data 里的日期格式是 Data String 化之后的值，展示的时候，我们将其转成了，方便阅读的 `yyyy-MM-dd` 格式。过滤的时候，用户肯定是期望也使用 `yyyy-MM-dd` 的格式来过滤。此时普通的字符串比较就解决不了问题了，我们需要 filterFn。

```html
/*vue*/
/*no-boot-code*/
<desc>
  键入 2017-7-2 试一试
</desc>

<template>
  <div>
    <el-input style='margin-bottom: 10px; width: 200px;' v-model='filters[0].value'></el-input>
    <data-tables
      :data='data'
      :filters='filters'>
      <el-table-column
        prop="flow_no"
        label="NO."
        sortable="custom">
      </el-table-column>
      <el-table-column
        prop="content"
        label="Content."
        sortable="custom">
      </el-table-column>
    <el-table-column
        prop="date"
        label="Date"
        sortable="custom">
        <template slot-scope="scope">
          <div>{{getDate(scope.row.date)}}</div>
        </template>
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
Vue.use(DataTables)

let data = [{
  "content": "Water flood",
  "flow_no": "FW201601010001",
  "date": "Wed Jul 08 2017 09:18:41 GMT+0800 (CST)"
  }, {
  "content": "Lock broken",
  "flow_no": "FW201601010002",
  "date": "Wed Jul 02 2017 14:19:29 GMT+0800 (CST)"
  }, {
  "content": "Help to buy some drinks",
  "flow_no": "FW201601010003",
  "date": "Wed Jul 03 2017 19:08:54 GMT+0800 (CST)"
}]

let titles = [{
  prop: "flow_no",
  label: "NO."
  }, {
  prop: "content",
  label: "Content"
  }, {
  prop: "flow_type",
  label: "Type"
}]

export default {
  data() {
    return {
      data,
      titles,
      filters: [
        {
          value: '',
          filterFn: (row, filter) => {
            return Object.keys(row).some(prop => {
              if (prop === 'date') {
                return this.getDate(row.date).indexOf(filter.value) > -1
              } else {
                return row[prop].toLowerCase().indexOf(filter.value.toLowerCase()) > -1
              }
            })
          }
        }
      ]
    }
  },
  methods: {
    getDate(date) {
      let elDate = new Date(date)
      return elDate.getFullYear() + '-'
        + (elDate.getMonth() + 1) + '-'
        + elDate.getDate()
    }
  }
}
</script>
```

## data-tables-server 的过滤
与 [data-tables-server 的排序](zh-cn/sort.md?id=data-tables-server-的排序) 一样, 本质上
 `data-tables-server` 也不参与数据的过滤工作, 过滤也只发生在后台，`data-tables-server` 只是需要把过滤规则发给后台。

在过滤条件变化的时，`data-tables-server` 发射一个类型为 `filters` 的 `query-change` 事件，外层组件需要监听该事件，并把向服务器发送请求来获取数据。

`query-info` 事件发射的数据的 `filter` 字段的值就等于 `this.filters`, 除了 value 字段是必须外，可以在定义 `this.filters` 的时候添加任何需要的字段，为后台的过滤提供其需要的信息。

下例中，由于后台需要一个 `search_prop` 属性来标记过滤的属性，我们就在定义过滤项的时候添加了这个属性。

```html
/*vue*/
<template>
  <div>
    <div style='margin-bottom: 10px; width: 200px;'>
      <el-input v-model='filters[0].value'></el-input>
    </div>
    <data-tables-server
      :data='data'
      :total='total'
      :filters='filters'
      :pagination-props='{ pageSizes: [5, 10, 15] }'
      @query-change='loadData'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label">
      </el-table-column>
    </data-tables-server>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      total: 0,
      filters: [
        {
          value: '',
          'search_prop': 'flow_no' // define search_prop for backend usage.
        }
      ]
    }
  },
  methods: {
    async loadData(queryInfo) {
      queryInfo.type === 'filter' &&
        this.$message(`search_prop: ${queryInfo.filters[0].search_prop},
          value: ${queryInfo.filters[0].value}`)
      let { data, total } = await http(queryInfo)
      this.data = data
      this.total = total
    }
  }
}
</script>
```
