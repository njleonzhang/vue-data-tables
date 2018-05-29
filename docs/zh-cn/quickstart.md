# 快速上手
> 开始旅程

## 安装

```
npm install vue-data-tables
或
yarn install vue-data-tables
```

# 引入

## 引入 element-ui
正如[前文](/#/zh-cn/)中提到的，本库依赖于 [element-ui](http://element.eleme.io/) 的 [el-table](http://element.eleme.io/#/zh-CN/component/table), [el-table-column](http://element.eleme.io/#/zh-CN/component/table), [el-button](http://element.eleme.io/#/zh-CN/component/button) 和 [el-pagination](http://element.eleme.io/#/zh-CN/component/pagination) 组件，所以在引入 `vue-data-tables` 之前, 我们需要先完整的引入 `element-ui` 或者[按需引入](http://element.eleme.io/#/zh-CN/component/quickstart) `el-table`, `el-table-column`, `el-button` 和 `el-pagination` 这4个组件。

```
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

`el-pagination` 这个组件设计 L10N, 所以如果需要的话，可以参考[文档](http://element.eleme.io/#/en-US/component/i18n#internationalization)配置L10N

```
// 设置L10N语言为英语
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
```

## 引入 vue-data-tables

```js
// 分别导入 DataTables 和 DataTableServer
import { DataTables, DataTableServer } from 'vue-data-tables'
Vue.use(DataTables)

// 同时使用 DataTables 和 DataTableServer
import VueDataTables from 'vue-data-tables'
Vue.use(VueDataTables)
```

# Hello world
```html
/*vue*/
<desc>
* 按这几个按钮试一试
* 试着排序一下列表
* 试着多创建一些数据，然后试试翻页
* 试着通过用在输入框里输入编号来过滤表格
</desc>
<template>
  <div>
    <div style='margin-bottom: 10px'>
      <el-row>
        <el-col :span='12'>
          <el-button @click='onCreate'>create 1 row</el-button>
          <el-button @click='onCreate100'>create 100 row</el-button>
        </el-col>
        <el-col :offset='6' :span='6'>
          <el-input placeholder='search NO.' v-model='filters[0].value'></el-input>
        </el-col>
      </el-row>
    </div>

    <data-tables
      :data='data'
      :action-col='actionCol'
      :filters='filters'>
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
          },
          label: 'delete'
        }]
      }
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
    }
  }
}
</script>
```
