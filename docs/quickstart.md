# Quick start
> Start the journey

# Install

```
npm install vue-data-tables
```

# Import in your project

```js
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import DataTables from 'vue-data-tables'

Vue.use(ElementUI)
Vue.use(DataTables)
```

# L10N (show English in pagination)

```js
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)
```
check [element-ui doc](http://element.eleme.io/#/en-US/component/i18n) for more detail

# Hello word
```html
/*vue*/
<desc>
  * click button `new` to add `row` to the table. 
  * click button `Edit` to edit the row
  * try to filter the table by checkbox filter and searchbox
</desc>
<template>
  <data-tables :data='data'
    :actions-def='actionsDef'
    :checkbox-filter-def='checkFilterDef'
    :action-col-def='actionColDef'>
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label" sortable="custom">
    </el-table-column>
  </data-tables>
</template>

<script>
export default {
  data() {
    return {
      data,
      titles,
      actionsDef: {
          colProps: {
            span: 5
          },
          def: [{
            name: 'new',
            handler: () => {
              this.data.push({
                'content': 'hello world',
                'flow_no': 'FW201601010004',
                'flow_type': 'Help',
                'flow_type_code': 'help',
              })
            },
            buttonProps: {
              type: 'text'
            }
          }, {
            name: 'import',
            handler: () => {
              this.$message('import clicked')
            },
            icon: 'upload'
          }]
        },
        checkFilterDef: {
          props: 'flow_type_code',
          def: [{
            'code': 'repair',
            'name': 'Repair'
          }, {
            'code': 'help',
            'name': 'Help'
          }]
       },
       actionColDef: {
           label: 'Actions',
          def: [{
            handler: row => {
              this.$message('Edit clicked')
              row.flow_no = "hello word"
            },
            name: 'Edit'
          }, {
            icon: 'message',
            type: 'text',
            handler: row => {
              this.$message('RUA in row clicked')
              console.log('RUA in row clicked', row)
            },
            name: 'RUA'
          }]
        }
    }
  },
  methods: {
      getRowActionsDef() {
        let self = this
        return [{
          type: 'primary',
          handler(row) {
            self.$message('Edit clicked')
            console.log('Edit in row clicked', row)
          },
          name: 'Edit'
        }]
      }
  }
}
</script>
```
