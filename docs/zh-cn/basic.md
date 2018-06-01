# 基本用法

## 渲染数据和刷新表格
我们通过 `data` 属性 为 `data-tables` 或 `data-tables-server` 传入数据，并通过[el-table-column](http://element.eleme.io/#/zh-CN/component/table)来定义表格的列。表格的内容会根据 `data` 定义的数据和 `el-table-column` 定义的列来自动呈现。

> 实际上，data 属性的值最终传给了内置的 [el-table](http://element.eleme.io/#/zh-CN/component/table) 组件; 所有的 `el-table-column` 也同样的被作为默认插槽传给了内置的 [el-table](http://element.eleme.io/#/zh-CN/component/table) 组件，所以关于如何利用 data 属性和 `el-table-column` 去渲染表格，如果你有疑惑，请完全参照 [el-table](http://element.eleme.io/#/zh-CN/component/table) 的文档。

1. `data-table` 的主要功能：

  - 自动的生成 pagination，并使之与表格联动。
    - pagination上的总数量是自动计算得到的。
    - 翻页的时候，展示的元素也会根据 `pageSize`（每页的数量） 和 `currentPage`（当前页的index）自动生成。
  - 排序和过滤会根据设置好的规则自动处理，详见相关章节：[排序]()、[过滤]()
<br/>
  ```html
    /*vue*/
    <template>
      <data-tables :data='data'
        :pagination-props='{ pageSizes: [5, 10, 15] }'>
        <el-table-column v-for="title in titles"
          :prop="title.prop"
          :label="title.label"
          :key="title.label">
        </el-table-column>
      </data-tables>
    </template>

    <script>
    export default {
      data() {
        return {
          data: [...new Array(30)].reduce((previous) => {
            return previous.concat(data)
          }, []),
          titles,
        }
      }
    }
    </script>
  ```

+  `data-tables-server` 的主要功能:

  - 根据 `total` 和 `data` 属性渲染表格。
  - 在翻页、过滤、每页数量变化、排序等情况发生的时候发出 `query-change` 事件，事件的 payload 里包含最新的过滤条件、每页数量、选中的页和排序规则等信息。外围组件可以根据这些信息去后台拉去数据。

  > data-tables 组件的 data 属性代表着所有的数据，pagination上显示的所有的 total 值就等于 `data.length`，所以使用 data-tables 组件的时候并不需要传入 total 属性; 而 data-tables-server 的 data 属性只是当前页的数据，total 属性代表着全部的数据量， 他们都需要使用的时候来传入。

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
        :key="title.label">
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
        console.log(queryInfo)
        let { data, total } = await http(queryInfo)
        this.data = data
        this.total = total
      }
    }
  }
  </script>
  ```

# 传递 prop 给内置的 el-table

可以通过 `table-props` 属性给 `data-table` 和 `data-tables-server` 内置的 `el-table` 传递[属性](http://element.eleme.io/#/zh-CN/component/table#table-attributes)。

> 所有的 el-table 的属性，现在通过一个 js 对象的方式来传递，所以建议把 kebabCase 属性写为 camelCase 然后使用，以便于 js 的书写。 比如 el-table 的 default-sort 如果写成不写成 camelCase，在 js 里需要加上引号， 即 { 'default-sort': VALUE }, 改写后可以写作  { defaultSort: VALUE }, 符合 js 的编码风格。

```html
/*vue*/
<desc>
  通过 `tableProps` 我们设置内置 `el-table` 的 `border` 和 `stripe` 属性为true。并设置默认的排序列和排序方向
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
        border: true,
        stripe: true,
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
# el-table 的插槽

`data-tables-server` 和 `data-tables` 支持 `el-table` 的 `empty` 和 `append` 两个插槽都支持。其具体用法请参照[文档](http://element.eleme.io/#/zh-CN/component/table), 下面给2个简单的示例：

* append 插槽

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
      <p slot="append">table slot</p>
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

* empty 插槽

  ```html
  /*vue*/
  <template>
    <data-tables-server
      :data='[]'
      :total='100'>
      <div slot="empty">
        <div style='color: red'>emptyyyyyyyyyyyyyy</div>
      </div>
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

# layout
layout 传入值是一个 `String`，是一个通过 `,` 隔开的元素组合, `vue-data-tables` 会根据顺序来显示表格的内容。可选的元素对应于 `vue-data-tables` 的3个部分：
* table 表格
* pagination 分页栏
* tool 工具栏, 请参照<a href='/#/zh-cn/actionBar'>工具栏</a>的章节

其默认值为 `"table, pagination"`, 即显示 `表格`和`分页栏`，不显示`工具栏`。

下例中，定义表格的显示`分页栏`和`表格`:

```html
  /*vue*/
  <template>
    <data-tables
      :data='data'
      :pagination-props='{ pageSizes: [5, 10, 15] }'
      layout='pagination, table'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label">
      </el-table-column>
    </data-tables>
  </template>

  <script>
  export default {
    data() {
      return {
        data: [...new Array(30)].reduce((previous) => {
          return previous.concat(data)
        }, []),
        titles,
        layout: 'pagination, table'
      }
    }
  }
  </script>
```

我们也可以不显示 `分页栏`:

```html
  /*vue*/
  <template>
    <data-tables
      :data='data'
      layout='table'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.label">
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
