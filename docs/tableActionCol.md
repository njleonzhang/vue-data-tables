# Table Action col
> customize the action col

# Define action col bar
leverage `action-col-def` to define action col


```html
/*vue*/
<desc>
Action column's head label is set to `Actions`, and two `button`s are defined for every row.
</desc>
<template>
  <data-tables :data='data'
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
            this.$message('RUA in row clicked ' + row.flow_no)
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

# Related properties

`data-tables` property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| action-col-def | define the action col | Object | - |

`action-col-def` object property

| Property | Desc | Type | Default value |
| -- | -- | -- | -- |
| label | the title label of action column | String | 操作(action in Chinese) |
| def | the defination of button in action column | Array of Object | - |

property of object in `action-col-def.def`

| Property | Desc | Type | Accepted Values | Default value | parameters |
| -- | -- | -- | -- | -- | -- |
| type | the type of `el-button` | String | primary<br/>success<br/>warning<br/>danger<br/>info<br/>text | text | - |
| name | label of the button | String | - |  - | - |
| handler(row, index, column, store) | callback for button click. | Function | - | - | 1. `row` represents the element corresponded to this row in `data` <br> 2. `index` indicate the index of the element in current page <br> 3. `column` and `store` are `e-table` internal variable, you may nearly never use them directly, export here for advanced usage |
