# Action Column

## Action column generator
`action-col` property can help to generate action column in `vue-data-tables` conveniently.

The value passed to `action-col` should be a `Object`.It's in the following format:

```
// Typescript-like definition
{
  label?: String;                // label of the action column
  props?: {                      // props passing to the embedded el-table-column
    [prop: string]: any;
  },
  buttons: [                     // definition of `el-button`s in the action column
    {
      props?: {                  // props passing to the el-button
        [prop: string]: any;
      },
      handler?: (row) => void;   // callback for the button click,
                                 // use arrow function, otherwise `this`
                                 // is not the component using `vue-data-table`.
                                 // Parameter `row` represents the data of the row
      label: String;             // el-button's label
    },
    ...
  ]
}
```

> The 2 `props` in the above definition is used to pass props to  [el-table-column](http://element.eleme.io/#/en-US/component/table#table-column-attributes) and [el-button](http://element.eleme.io/#/en-US/component/button#attributes) respectively. Similar to [table-props](en-us/basic.md?id=pass-props-to-the-embedded-el-table), we suggest write the js property in `camelCase`

In the following example, label of action column is set to `Actionsssssss`; content align of action column is set to `center`; 2 buttons are defined with callback functions; the first button is set to primary type with icon `el-icon-edit`.

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

## Customize the action column
The action column created by generator can only contain `el-button`, at the same time, can not generate different buttons according to different rows. You can customize action column by slot-scope of `el-table-column`, refer to the [document]((http://element.eleme.io/#/en-US/component/table#custom-column-template)) for more details.

In the following example, action column contains `el-button` and `el-checkbox`, and the content is different between rows.

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
      this.$message(`click drapdown button ${command}`)
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

The above example is implemented in Vue template syntax, if we implements it in vue [jsx](https://vuejs.org/v2/guide/render-function.html), the logic may be more clean and easy to understand, refer to the [vue jsx document](https://vuejs.org/v2/guide/render-function.html) and [source code](https://github.com/njleonzhang/vue-data-tables/blob/master/src/mixins/ShareMixin.js) of this lib for details.
