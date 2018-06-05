# 动作列

# 快速生成动作列
通过 `action-col` 属性，我们可以在 `vue-data-tables` 上快速创建动作列。

传入 `action-col` 的对象的格式如下：

```
// 以类似typescript的定义格式描述
{
  label?: String;                // 动作列的表头
  props?: {                      // 用于传入动作列 el-table-column 的 prop
    [prop: string]: any;
  },
  buttons: [                     // 定义动作列里的 el-button 元素
    {
      props?: {                  // 用于传入 el-button 的 prop
        [prop: string]: any;
      },
      handler?: (row) => void;   // 点击事件的 callback, 注意使用箭头函数，
                                 // 否则 `this` 就不是使用 `vue-data-table` 组件了。
                                 // 参数 row 为此列的数据。
      label: String;             // 按钮的 label
    },
    ...
  ]
}
```

> 上面的两个 props 分别用于传入 [el-table-column](http://element.eleme.io/#/zh-CN/component/table#table-column-attributes) 和 [el-button](http://element.eleme.io/#/zh-CN/component/button#attributes) 的属性，与 [table-props](zh-cn/basic.md?id=传递-prop-给内置的-el-table) 类似，建议使用 camelCase 风格来写书 js 对象的属性。


下例中，我们设置了动作列的表头(`Actionsssssss`)、列内容的对齐方式(`center`), 并定义了2个按钮(`el-button`)，为它们绑定了点击的回调函数，还为第一个按钮设置了类型(`primary`) 和 图标 (`el-icon-edit`)。

```html
/*vue*/
<template>
  <data-tables :data='data'
    :action-col='actionCol'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key='title.prop'>
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      actionCol: {
        label: 'Actionsssssss',
        props: {
          align: 'center',
        },
        buttons: [{
          props: {
            type: 'primary',
            icon: 'el-icon-edit'
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
  }
}
</script>
```

# 自定义动作列
快速生成的动作列只能生成按钮，不支持按列定制。如果有需要，你可以自己定义动作列，可以通过 slot-scope 来把动作列自定义为你需要的任何内容。实际上这是 `el-table` 所提供的[自定义列模板](http://element.eleme.io/#/zh-CN/component/table#zi-ding-yi-lie-mo-ban)的方法

下例中，动作列中不仅有 `el-button` 还有 `el-checkbox`, 同时不同的列显示的动作也不一样。

```html
/*vue*/
<template>
  <data-tables-server
    :data='data'
    :total='1000'
    @query-change='loadData'
    :pagination-props='{ pageSizes: [5, 10, 15] }'
  >
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop">
    </el-table-column/>
    <el-table-column
      label="Actions"
      min-width="100px">
      <template slot-scope="scope">
        <el-button
          v-for="button in customButtonsForRow(scope.row)"
          :key="button.name"
          type="text"
          @click="button.handler">
          {{ button.name }}
        </el-button>
        <el-checkbox :value='true'>delete</e-checkbox>
      </template>
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles
    }
  },
  methods: {
    handleClick(command) {
      this.$message(`click dropdown button ${command}`)
    },
    async loadData(queryInfo) {
      let { data, total } = await http(queryInfo)
      this.data = data
      this.total = total
    },
    customButtonsForRow(row) {
       if (row.flow_type_code === 'repair') {
         return [{
            name: 'repairing',
            handler: _ => {
               this.$message(`repairing ${row.flow_no}`)
            }
         }, {
            name: 'repaired',
            handler: _ => {
                this.$message(`repaired ${row.flow_no}`)
            }
         }]
       } else {
         return [{
            name: 'help me',
            handler: _ => {
               this.$message(`help you ${row.flow_no}`)
            }
         }]
       }
    }
  }
}
</script>
```

上例的逻辑，使用 vue 模板语言来写有点吃力，并且代码也不清晰。建议使用 jsx 来实现, 请参考 vue 的[相关文档](https://cn.vuejs.org/v2/guide/render-function.html) 和本库的[源码](https://github.com/njleonzhang/vue-data-tables/blob/master/src/mixins/ShareMixin.js)
