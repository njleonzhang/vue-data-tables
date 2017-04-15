<style lang='scss'>
  body {
    margin: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .app-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>

<template lang="pug">
  .app-wrapper
    data-tables(:data='tableData', :actions-def='getActionsDef()', :checkbox-filter-def='getCheckFilterDef()', :row-action-def='getRowActionsDef()')
      el-table-column(prop='flow_no', label='No.', sortable='custom')
      el-table-column(prop='content', label='Content', sortable='custom')
      el-table-column(prop='create_time', label='Time', sortable='custom')
      el-table-column(prop='state', label='State', sortable='custom')
      el-table-column(prop='flow_type', label='Type', sortable='custom')
      el-table-column(prop='building_group', label='Building group', sortable='custom')
      el-table-column(prop='building', label='building', sortable='custom')
      el-table-column(prop='room_no', label='no', sortable='custom')
      el-table-column(prop='cellphone', label='tel', sortable='custom')
</template>

<script>
  import dataTables from '../src/index.js'

  export default {
    components: {dataTables},
    data() {
      return {
        tableData: []
      }
    },
    created() {
      this.tableData = [{
        'building': '5',
        'building_group': 'North',
        'cellphone': '13400000000',
        'content': 'Water flood',
        'create_time': '2016-10-01 22:25',
        'flow_no': 'FW201601010001',
        'flow_type': 'Repair',
        'flow_type_code': 'repair',
        'id': '111111',
        'room_id': '00501',
        'room_no': '501',
        'state': 'Created',
        'state_code': 'created'
      }, {
        'building': '6',
        'building_group': 'Sourth',
        'cellphone': '13400000000',
        'content': 'Lock broken',
        'create_time': '2016-10-01 22:25',
        'flow_no': 'FW201601010002',
        'flow_type': 'Repair',
        'flow_type_code': 'repair',
        'id': '2222222',
        'room_id': '00701',
        'room_no': '701',
        'state': 'Assigned',
        'state_code': 'assigned'
      }, {
        'building': '9',
        'building_group': 'North',
        'cellphone': '13400000000',
        'content': 'Help to buy some drinks',
        'create_time': '2016-10-02 22:25',
        'flow_no': 'FW201601010002',
        'flow_type': 'Help',
        'flow_type_code': 'help',
        'id': '2222222',
        'room_id': '00601',
        'room_no': '601',
        'state': 'Closed',
        'state_code': 'closed'
      }]
    },
    methods: {
      getActionsDef() {
        let self = this
        return {
          width: 5,
          def: [{
            name: 'new',
            handler() {
              self.$message('new clicked')
            },
            icon: 'plus'
          }, {
            name: 'import',
            handler() {
              self.$message('import clicked')
            },
            icon: 'upload'
          }]
        }
      },
      getCheckFilterDef() {
        return {
          width: 14,
          props: 'state_code',
          def: [{
            'code': 'created',
            'name': 'Created'
          }, {
            'code': 'assigned',
            'name': 'Assigned'
          }, {
            'code': 'accepted',
            'name': 'Accepted'
          }, {
            'code': 'closed',
            'name': 'Closed'
          }, {
            'code': 'cancelled',
            'name': 'Cancelled'
          }]
        }
      },
      getRowActionsDef() {
        let self = this
        return [{
          type: 'primary',
          handler(row) {
            self.$message('Edit clicked')
            console.log('Edit in row clicked', row)
          },
          name: 'Edit'
        }, {
          type: 'primary',
          handler(row) {
            self.$message('RUA in row clicked')
            console.log('RUA in row clicked', row)
          },
          name: 'RUA'
        }]
      }
    }
  }
</script>
