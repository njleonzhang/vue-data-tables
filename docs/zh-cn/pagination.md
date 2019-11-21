# 分页

`vue-data-tables` 的分页栏实际上就是一个内置的 [el-pagination](http://element.eleme.io/#/zh-CN/component/pagination). 我们可以通过 `pagination-props`, `current-page` 和 `page-size` 来对其进行定制。

* `current-page`: 用于设置当前选中的页面，可以使用 sync 后缀。
* `page-size`: 用于设置当前的每页面个数，可以使用 sync 后缀。
* `pagination-props`: 与 [table-props](zh-cn/basic.md?id=传递-prop-给内置的-el-table) 类似，支持通过 js 对象给内置的 `el-pagination` 传递属性。

下例中, 我们把 `pageSizes` 设置成了 [1, 2, 3]。当前的每页数量 pageSize 设置成了 1, 当前的页为第 2 页，同时还是设置背景色。

```html
/*vue*/
<template>
  <data-tables :data="data"
    :current-page='2'
    :page-size='1'
    :pagination-props='{ background: true, pageSizes: [1, 2, 3] }'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
    />
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles
    }
  }
}
</script>
```

使用 sync 后缀，让我们更加方便的通过 js 控制页面的翻页和每页大小：


```html
/*vue*/
<template>
  <div>
    <div style='margin-bottom: 10px;'>
      <span>currentPage: </span>
      <el-input-number v-model='currentPage'></el-input-number>
    </div>
    <data-tables-server
      :data="data"
      :total='total'
      :current-page.sync='currentPage'
      :page-size='pageSize'
      :pagination-props='{ background: true, pageSizes: [1, 2, 3] }'
      @query-change='loadData'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"/>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      total: 0,
      currentPage: 2,
      pageSize: 1
    }
  },
  methods: {
    async loadData(queryInfo) {
      console.log('queryInfo: ', queryInfo)
      let { data, total } = await http(queryInfo)
      this.data = data
      this.total = total
    }
  }
}
</script>
```

# data-tables-server 的分页

和 data-tables-server 的[排序](zh-cn/sort?id=data-tables-server-的排序)和[过滤](zh-cn/filter?id=data-tables-server-的过滤)一样，本质上 `data-tables-server` 也不参与数据的分页工作，分页发生在后台。分页信息变化时，`data-tables-server` 只是需要把最新的分页信息发给后台。

分页信息包括: `每页的数量` 和 `当前页`。在这2项发生变化时，`data-tables-server` 会发射 `query-change` 事件，外层组件需要监听该事件，并把向服务器发送请求来获取数据。

* `每页的数量` 的改变会触发类型为 `size` 的 `query-change` 事件
* `当前页` 的改变会触发类型为 `page` 的 `query-change` 事件

`query-info` 事件的载荷数据有 `page` 和 `pageSize` 2个属性，分别对应`每页的数量` 和 `当前页`。

下例展示了如何通过监听 query-info 事件来处理分页：

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
      (queryInfo.type === 'page' ||
        queryInfo.type === 'size') &&
        this.$message(`page: ${queryInfo.page}, pageSize: ${queryInfo.pageSize}`)
      let { data, total } = await http(queryInfo)
      this.data = data
      this.total = total
    }
  }
}
</script>
```

# pagination slot 的支持 (3.4.5+)

```html
/*vue*/
<template>
  <data-tables :data="data"
    :pagination-props='{ layout: "sizes, prev, pager, next, jumper, ->, total, slot" }'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
    />
  </data-tables>

  <span slot="pagination" style='color: red'>我是 pagination 插槽</span>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles
    }
  }
}
</script>
```