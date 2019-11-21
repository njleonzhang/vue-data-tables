# 基本用法

## 渲染数据和刷新表格
我们通过 `data` 属性 为 `vue-data-tables` 传入数据，并通过[el-table-column](http://element.eleme.io/#/zh-CN/component/table#table-column-attributes)来定义表格的列。表格的内容会根据 `data` 定义的数据和 `el-table-column` 定义的列来自动呈现。

实际上，data 属性的值最终传给了内置的 [el-table](http://element.eleme.io/#/zh-CN/component/table) 组件; 所有的 `el-table-column` 也同样的被作为默认插槽传给了内置的 [el-table](http://element.eleme.io/#/zh-CN/component/table) 组件，所以关于如何利用 data 属性和 `el-table-column` 去渲染表格，如果你有疑惑，请完全参照 [el-table](http://element.eleme.io/#/zh-CN/component/table) 的文档。

1. `data-table` 的主要功能：

  - 自动的生成 pagination，并使之与表格联动。
    - pagination上的总数量是自动计算得到的。
    - 翻页的时候，展示的元素也会根据 `pageSize`（每页的数量） 和 `currentPage`（当前页的index）自动生成。
  - 根据设置来处理排序和过滤，详见相关章节：[排序](zh-cn/sort.md) and [过滤](zh-cn/filter.md)。
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
  - 通过 `loading` 属性显示或影藏加载蒙层。

  > data-tables 组件的 data 属性代表着所有的数据，pagination 上显示的所有的 total 值就等于 `data.length`，所以使用 data-tables 组件的时候并不需要传入 total 属性; 而 data-tables-server 的 data 属性只是当前页的数据，total 属性代表着全部的数据量， 他们都需要使用的时候来传入。

  ```html
  /*vue*/
  <template>
    <data-tables-server
      :data='data'
      :total='total'
      :loading='loading'
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
        loading: false,
        total: 0,
      }
    },
    methods: {
      async loadData(queryInfo) {
        console.log(queryInfo)
        this.loading = true
        let { data, total } = await http(queryInfo, 500)
        this.data = data
        this.total = total
        this.loading = false
      }
    }
  }
  </script>
  ```

# 传递 prop 给内置的 el-table

可以通过 `table-props` 属性给 `data-table` 和 `data-tables-server` 内置的 `el-table` 传递[属性](http://element.eleme.io/#/zh-CN/component/table#table-attributes)。

`table-props` 接受的是一个 js 对象, 所有的 el-table 的属性，都通过这个 js 对象的方式来传递。Vue 组件的 prop 一般定义的时候习惯写成了 kebabCase 风格，但是我们要通过 js 对象传递他们，在 js 对象里写 kebabCase 的属性是很不方便的，因为要加上引号, 例如 `{ 'default-sort': VALUE }`。好在 Vue 内部的原理支持我们把属性写成 camelCase 风格, 即 `{ defaultSort: VALUE }`.

下例中, 我们设置内置 `el-table` 的 `border` 和 `stripe` 属性为true。并设置默认的排序列和排序方向

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
# el-table 和 el-pagination 的插槽

1. `vue-data-tables` 支持 `el-table` 的 `empty` 和 `append` 两个插槽。其具体用法请参照[文档](http://element.eleme.io/#/zh-CN/component/table), 下面给2个简单的示例：

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
        <div slot="empty" style='color: red'>emptyyyyyyyyyyyyyy</div>
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

2. `vue-data-tables` 还支持 `el-pagination` 的默认插槽。详情参照[分页](zh-cn/pagination.md)

# Layout
layout 传入值是一个 `String`，是一个通过 `,` 隔开的元素组合, `vue-data-tables` 会根据顺序来显示表格的内容。可选的元素对应于 `vue-data-tables` 的3个部分：
* table 表格
* pagination 分页栏
* tool 工具栏, 请参照[工具栏](zh-cn/actionBar.md)的章节

其默认值为 `"tool, table, pagination"`, 即依次显示`工具栏`, `表格`和`分页栏`。

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
        data: [...new Array(5)].reduce((previous) => {
          return previous.concat(data)
        }, []),
        titles,
      }
    }
  }
  </script>
```
