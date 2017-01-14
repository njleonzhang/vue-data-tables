<template lang='pug'>
  #app
    data-tables(
      :data='tableData',
      :tool-bar-def='toolBarDef',
      :row-action-def='rowActionsDef',
      @row-click='rowClick')
      el-table-column(prop='flow_no', label='服务编号', sortable='custom')
      el-table-column(prop='content', label='服务内容', sortable='custom')
      el-table-column(prop='create_time', label='服务时间', sortable='custom')
      el-table-column(prop='state', label='服务状态', sortable='custom')
      el-table-column(prop='flow_type', label='服务类型', sortable='custom')
      el-table-column(prop='building_group', label='分区', sortable='custom')
      el-table-column(prop='building', label='楼栋', sortable='custom')
      el-table-column(prop='room_no', label='房号', sortable='custom')
      el-table-column(prop='cellphone', label='手机号', sortable='custom')
</template>

<script>
import DataTables from '../src/index.js'
import mockData from './mock'

export default {
  name: 'app',
  components: {
    DataTables
  },

  data() {
    return {
      tableData: [],
      rowActionsDef: this.getRowActionsDef(),
      toolBarDef: this.getToolBarDef()
    }
  },

  created() {
    for (var i = 0; i < 100; i++) {
      this.tableData = this.tableData.concat(mockData.list)
    }
  },

  methods: {
    getToolBarDef() {
      let self = this

      let actions = [{
        name: '新 建',
        handler() {
          console.log('click', self)
          self.$message('新建clicked')
        },
        icon: 'plus'
      }, {
        name: '导入',
        handler() {
          console.log('导入', self)
          self.$message('导入 clicked')
        },
        icon: 'upload'
      }]

      return {
        actions: {
          width: 5,
          def: actions
        },
        filters: {
          width: 14,
          prop: 'state_code',
          def: [
            {
              'code': 'created',
              'name': '未处理'
            },
            {
              'code': 'assigned',
              'name': '已派工'
            },
            {
              'code': 'accepted',
              'name': '已接单'
            },
            {
              'code': 'closed',
              'name': '已结束'
            },
            {
              'code': 'cancelled',
              'name': '已取消'
            }
          ]
        }
      }
    },

    getRowActionsDef() {
      let self = this
      return [{
        type: 'primary',
        handler(row) {
          console.log('修改 clicked', row, self)
          self.$message('修改 clicked')
        },
        tip: '修改'
      }, {
        type: 'primary',
        handler(row) {
          console.log('RUA in row clicked', row, self)
          self.$message('RUA in row clicked')
        },
        tip: 'RUA'
      }]
    },

    rowClick(row) {
      console.log('rowClicked', row)
    }
  }
}
</script>
