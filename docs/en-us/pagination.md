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

# Pagination of data-tables-server

Same to [Sort](en-us/sort?id=sort-of-data-tables-server) and [Filter](en-us/filter?id=filter-of-data-tables-server) of `data-tables-server`, `data-tables-server` doesn't take charge the data `pagination` either, the `pagination` is also handled by back-end server. What `data-tables-server` need to do is emitting the pagination information when the pagination information changes, so that the back-end server can paginate and return new data according to the information.

Pagination information includes `item count of each page` and `current page`. When these 2 items change, `data-tables-server` emits emits a event named `query-change`.

* When `item count of each page` changes, the event is emitted with type `size`.
* When `current page` changes, the event is emitted with type `page`.

The payload of `query-info` event has property `page` and `pageSize`, which respectively represent `item count of each page` and `current page`.

Example to demonstrate how to handle `query-info` for pagination.

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

# support for pagination slot (3.4.5+)

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

  <span slot="pagination" style='color: red'>I am slot</span>
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