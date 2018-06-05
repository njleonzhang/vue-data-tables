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
