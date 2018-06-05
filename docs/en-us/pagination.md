# Pagination

The pagination of `vue-data-tables` is a embedded [el-pagination](http://element.eleme.io/#/en-US/component/pagination), `vue-data-tables` provide property `pagination-props`, `current-page` and `page-size` to customize it.

* `current-page`: set the current page number, supports the .sync modifier
* `page-size`: set item count of each page，supports the .sync modifier
* `pagination-props`: Similar to [table-props](en-us/basic.md?id=pass-props-to-the-embedded-el-table)，used to pass props to the embedded [el-pagination](http://element.eleme.io/#/en-US/component/pagination) with a `js` Object

In the following example, options of item count per page is set to [1, 2, 3]; item count of each page is set to 1; current page is set to 2; pagination background is also set.

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

With sync modifier, it's convenient to control the page change with `javascript`:

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
