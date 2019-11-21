# Basic Usage

## Render and refresh the Table
We pass source data to `vue-data-tables` by prop `data`, and define the column by [el-table-column](http://element.eleme.io/#/en-US/component/table#table-column-attributes). The table can show automatically according to `data` and `el-table-column`s.

At low level, the prop `data` is passed to the embedded [el-table](http://element.eleme.io/#/en-US/component/table) as [el-table](http://element.eleme.io/#/en-US/component/table)'s data prop, all `el-table-column`s are also passed to [el-table](http://element.eleme.io/#/en-US/component/table) as default slot. So you can refer to [el-table](http://element.eleme.io/#/en-US/component/table) to understand how the table is rendered.

1. main feature of `data-table`:

  - auto-generate pagination and make it link with table。
    - the `total` value is calculated automatically according to `data` and `filters`。
    - when pagination navigates, render correct element in the table according to `pageSize` and `currentPage`.
  - handle `sort` and `filter` according to configuration, refer to [Sort](en-us/sort.md) and [Filter](en-us/filter.md) for more details.
<br/>

  ** A basic sample: **
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

+  main feature of `data-tables-server`:

  - render the table according to `data` and `total`
  - when pagination navigates、per-page size changes、filter condition changes and sort condition changes, emit a `query-change` event, whose payload contains the information about newest filter condition、per-page size、current page and sort condition. The outer component can listen on this event, and pull data from server according the payload.
  - toggle loading mask according to property `loading`

  > the value passed to `data` prop of `data-tables` should be the entire data, `total` shown in pagination is equal to `data.length`, so `data-tables` don't need a `total` prop. However, the `data` prop of `data-tables-server` is just the data of current page, `total` can not be calculated, so we need pass both `data` and `total` to `data-tables-server`.

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

# Pass props to the embedded el-table

We can pass [props](http://element.eleme.io/#/en-US/component/table#table-attributes) to the embedded `el-table` by `table-props` prop of `vue-data-tables`.

`table-props` accept a js Object, all props of `el-table` can be passed by this Object. prop of Vue component is generally defined in `kebabCase` style, but we need write these props in a js Object. As you know, writing js Object properties in `kebabCase` style is not convenient because of the `quotation mark`, for example, `{ 'default-sort': VALUE }`. The good news is that `Vue`'s principle allows us to write prop to `camelCase` in this scenario, `{ defaultSort: VALUE }`.

In the following sample, we set the `border` and `stripe` prop of the embedded `el-table` to true. default sort column and order are also configured.

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
# Slots of el-table and el-pagination

1. The slots of `el-table`, `empty` and `append`, can be used in `vue-data-tables`, for details of the slots, check the [document](http://element.eleme.io/#/en-US/component/table).

  Reference example:

  * `append` slot

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

  * `empty` slot

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
2. `vue-data-tables` also supports the default slot of `el-pagination`, for details, go to [Pagination](en-us/pagination.md).


# Layout
layout accept a `String`, which can be compose of the following 3 elements (joined by `,`). `vue-data-tables` render the components according to the order of the elements.

* table: the table
* pagination: pagination
* tool: tool bar, refer to section [Tool bar](en-us/actionBar.md)
The default value is `"tool, table, pagination"`, indicating render `tool bar`, `table` and `pagination` in sequence.

example to render `pagination` and `table`:

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

example to render `table` without `pagination`:

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
