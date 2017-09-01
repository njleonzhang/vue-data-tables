# Define you own action column

Sometimes, you need more than buttons in the action columns.
Sometimes, you need different actions for different row.
In these situations, the `default action column` can not meet your requirement,
just define your own action column to rescue.

```html
/*vue*/
<desc>
  Add a `el-table-column` to table and define the action with your own logic.
</desc>
<template>
  <data-tables
    :data='data'
  >
    <el-table-column v-for="title in titles"
      :prop="title.prop"
      :label="title.label"
      :key="title.prop"
      sortable="custom">
    </el-table-column/>
    <el-table-column
      label="Actions"
      min-width="100px">
      <template scope="scope">
        <el-button
          v-for="button in customButtonsForRow(scope.row)"
          :key="button.name"
          type="text"
          @click="button.handler">
          {{ button.name }}
        </el-button>
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
