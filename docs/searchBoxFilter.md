# Search Box filter
> customize the search box

# show search box
search box is shown by default and filter all properties of the table element.

```html
/*vue*/
<desc>
`colProps` can be leveraged to define the `el-col` wrapped search box
</desc>
<template>
  <data-tables
    :data='data'
    :search-def='searchDef'>
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
      searchDef: {
        colProps: {
          span: 14
        }
      }
    }
  }
}
</script>
```

# customize the input
`searchDef.inputProps` can be leveraged to customize the `el-input` of search box

```html
/*vue*/
<desc>
Set the input placeholder
</desc>
<template>
  <data-tables
    :data='data'
    :search-def='searchDef'>
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
      searchDef: {
        inputProps: {
          placeholder: 'please search'
        }
      }
    }
  }
}
</script>
```

# hide search box

`searchDef.show` can be used to hide search box

```html
/*vue*/
<template>
  <data-tables
    :data='data'
    :search-def='searchDef'>
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
      searchDef: {
        show: false
      }
    }
  }
}
</script>
```

# search special properties

`searchDef.props` can be used to indicate target property[s] of search

```html
/*vue*/
<desc>
  make search box only match property `content`. `props` can be `String` or `Array`
</desc>
<template>
  <data-tables
    :data='data'
    :search-def='searchDef'>
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
      searchDef: {
        props: 'content'
      }
    }
  }
}
</script>
```

# customize filter logic

Sometimes, default filter logic can not satisfy your requirement, `searchDef.filterFunction` can be leveraged to customize the filter logic

```html
/*vue*/
/*no-boot-code*/
<desc>
The `date` property in `data` is in `JS Date String` format. For legibility, it is converted to `yyyy-MM-dd` format for showing. To search with `yyyy-MM-dd` format date, a customized `filterFunction` is needed
</desc>
<template>
  <data-tables
    :data='data'
    :search-def='searchDef'>
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
      <template scope="scope">
        <div>{{getDate(scope.row.date)}}</div>
      </template>
    </el-table-column>
  </data-tables>
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
      searchDef: {
        filterFunction: (el, filter) => {
          return Object.keys(el).some(prop => {
            if (prop === 'date') {
              return this.getDate(el.date).indexOf(filter.vals[0]) > -1
            } else {
              return el[prop].toLowerCase().indexOf(filter.vals[0].toLowerCase()) > -1
            }
          })
        }
      }
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

# Related properties

`data-tables` property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| search-def | define search box filter | Object | - |

`search-def` object property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| show | show or hide the search box | Boolean | true |
| debounceTime | typing debounce time for search box | Number | 200 |
| colProps | [el-col property](http://element.eleme.io/#/en-US/component/layout#col-attributes) of seach box area | Object | {span: 5} |
| inputProps | [el-input property](http://element.eleme.io/#/en-US/component/input#input-attributes) of seach box | Object | - |
| props | define the search box match properties | Array | - |
| filterFunction | customize the search filter logic | Array | - |
