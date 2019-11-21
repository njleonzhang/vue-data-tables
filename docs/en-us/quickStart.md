# Quick Start

## Installation

```
npm install vue-data-tables
or
yarn add vue-data-tables
```

# Import vue-data-tables

## import element-ui
As mentioned in the [front section](/en-us/?id=vue-data-tables), `vue-data-tables` depends on the components: [el-table](http://element.eleme.io/#/en-US/component/table), [el-table-column](http://element.eleme.io/#/en-US/component/table#table-column-attributes), [el-button](http://element.eleme.io/#/en-US/component/button) and [el-pagination](http://element.eleme.io/#/en-US/component/pagination) and the directive [loading](http://element.eleme.io/#/en-US/component/loading) of [element-ui](http://element.eleme.io/), so we need entirely import `element-ui` or import the components and the directive on demand before importing `vue-data-tables`.

```
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

> refer to [element-ui](http://element.eleme.io/#/en-US/component/quickstart) doc for how to import components on demand


refer to the [i18n doc](http://element.eleme.io/#/en-US/component/i18n#internationalization), when use in non-chinese environment.

```
// set language to EN
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
```

## import vue-data-tables

### import bundled vue-data-tables (recommended and straightforward)
```js
// import DataTables and DataTablesServer separately
import { DataTables, DataTablesServer } from 'vue-data-tables'
Vue.use(DataTables)
Vue.use(DataTablesServer)

// import DataTables and DataTablesServer together
import VueDataTables from 'vue-data-tables'
Vue.use(VueDataTables)
```

## import vue-data-tables source code
You can import the source code of this lib to decrease the code size, if you really care about it.

> vue-loader 15+ is needed to make this work.

1. install and configure [lodash](https://lodash.com/) and the following babel plugins:
  * [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
  * [babel-plugin-vue-jsx-sync](https://github.com/njleonzhang/babel-plugin-vue-jsx-sync)
  * [babel-plugin-jsx-v-model](https://github.com/nickmessing/babel-plugin-jsx-v-model)
  * [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)

* revise webpack configuration to make babel parse the source code of `vue-data-tables`
```
  // webpack config
  {
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: file => {
      return /node_modules/.test(file) &&
        (!/\.vue\.js/.test(file) &&
          !/vue-data-tables\/src\/mixins\/ShareMixin\.js/.test(file))
    }
  },
```

* revise the `import`

```
import { DataTables, DataTablesServer } from 'vue-data-tables/src/index.js'
```

## polyfill
This library relies on es6 api [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), you need polyfill it according to your situation.

# Hello world
* try the buttons
* try to sort the data
* try to create some data, and then page left and right
* try to enter something in the input box to filter the data

```html
/*vue*/
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='18'>
          <el-button @click='onCreate'>create 1 row</el-button>
          <el-button @click='onCreate100'>create 100 row</el-button>
          <el-button @click='bulkDelete'>bulk delete</el-button>
        </el-col>

        <el-col :span='6'>
          <el-input placeholder='search NO.' v-model='filters[0].value'></el-input>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :action-col='actionCol'
      :filters='filters'
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"
      >
      </el-table-column>
    </data-tables>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      filters: [{
        prop: 'flow_no',
        value: ''
      }],
      actionCol: {
        props: {
          label: 'Actionssss',
        },
        buttons: [{
          props: {
            type: 'primary'
          },
          handler: row => {
            this.$message('Edit clicked')
            row.flow_no = 'hello word' + Math.random()
            row.content = Math.random() > 0.5 ? 'Water flood' : 'Lock broken'
            row.flow_type = Math.random() > 0.5 ? 'Repair' : 'Help'
          },
          label: 'Edit'
        }, {
          handler: row => {
            this.data.splice(this.data.indexOf(row), 1)
            this.$message('delete success')
          },
          label: 'delete'
        }]
      },
      selectedRow: []
    }
  },
  methods: {
    onCreate() {
      this.data.push({
        content: "new created",
        flow_no: "FW201601010003" + Math.floor(Math.random() * 100),
        flow_type: "Help",
        flow_type_code: "help"
      })
    },
    onCreate100() {
      [...new Array(100)].map(_ => {
        this.onCreate()
      })
    },
    handleSelectionChange(val) {
      this.selectedRow = val
    },
    bulkDelete() {
      this.selectedRow.map(row => {
        this.data.splice(this.data.indexOf(row), 1)
      })
      this.$message('bulk delete success')
    }
  }
}
</script>
```
