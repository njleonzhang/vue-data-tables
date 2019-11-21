# 快速上手
> 开始旅程

## 安装

```
npm install vue-data-tables
或
yarn add vue-data-tables
```

# 引入

## 引入 element-ui
正如[前文](/zh-cn/?id=vue-data-tables)中提到的，本库依赖于 [element-ui](http://element.eleme.io/) 的 [el-table](http://element.eleme.io/#/zh-CN/component/table), [el-table-column](http://element.eleme.io/#/zh-CN/component/table#table-column-attributes), [el-button](http://element.eleme.io/#/zh-CN/component/button) 和 [el-pagination](http://element.eleme.io/#/zh-CN/component/pagination) 组件, 以及 [loading](https://element.eleme.io/#/zh-CN/component/loading) 指令，所以在引入 `vue-data-tables` 之前, 我们需要先完整的引入 `element-ui` 或者[按需引入](http://element.eleme.io/#/zh-CN/component/quickstart) 这些组件和指令。

```
// entirely import
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

> 参考 [element-ui](http://element.eleme.io/#/en-US/component/quickstart) 文档去了解如果做按需引入。

`el-pagination` 这个组件涉及 L10N, 所以如果需要的话，可以参考[文档](http://element.eleme.io/#/en-US/component/i18n#internationalization)配置L10N

```
// 设置L10N语言为英语
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
```

## 引入 vue-data-tables

### 引入打包之后的 vue-data-tables (推荐, 简单)
```js
// 分别导入 DataTables 和 DataTablesServer
import { DataTables, DataTablesServer } from 'vue-data-tables'
Vue.use(DataTables)
Vue.use(DataTablesServer)

// 同时使用 DataTables 和 DataTablesServer
import VueDataTables from 'vue-data-tables'
Vue.use(VueDataTables)
```

## 引入 vue-data-tables 源码
如果你对引入库的大小有苛刻的要求，可以通过引入本库源码的方式来，降低引入代码的体积。

> 引入源码的前提是你使用的 vue-loader 是 15+ 的版本。

1. 安装并配置本库的依赖 [lodash](https://lodash.com/) 和 babel 插件:
  * [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash)
  * [babel-plugin-vue-jsx-sync](https://github.com/njleonzhang/babel-plugin-vue-jsx-sync)
  * [babel-plugin-jsx-v-model](https://github.com/nickmessing/babel-plugin-jsx-v-model)
  * [babel-plugin-transform-vue-jsx](https://github.com/vuejs/babel-plugin-transform-vue-jsx)

* 修改 webpack 配置，让 babel 去处理 vue-data-tables 的源码
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

* 修改引入的代码为

```
import { DataTables, DataTablesServer } from 'vue-data-tables/src/index.js'
```

# polyfill
本库依赖于 es6 api [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), 请根据自己的情况自行 polyfill。

# Hello world
* 按这几个按钮试一试
* 试着排序一下列表
* 试着多创建一些数据，然后试试翻页
* 试着通过用在输入框里输入编号来过滤表格

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
