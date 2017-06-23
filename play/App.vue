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
    data-tables(
      :data='tableData',
      :actions-def='actionsDef',
      :checkbox-filter-def='checkFilterDef',
      :search-def='searchDef',
      :action-col-def='actionColDef',
      :custom-filter='customFilter',
      :tableProps='tableProps',
      :pagination-def='paginationDef',
      @selection-change='handleSelectChange'
      @row-click='handleRowClick')

      //- el-col(slot='actionBar', :span='5')
      //-   el-input( v-model='customFilter.vals')

      el-table-column(type='selection' width='55')
      el-table-column(prop='flow_no', label='No.', sortable='custom')
      el-table-column(prop='content', label='Content', sortable='custom')
      el-table-column(prop='create_time', label='Time', sortable='custom')
      el-table-column(prop='state', label='State', sortable='custom')
      el-table-column(prop='flow_type', label='Type', sortable='custom')
      el-table-column(prop='building_group', label='Building group', sortable='custom')
      el-table-column(prop='building', label='building', sortable='custom')
      el-table-column(prop='room_no', label='no', sortable='custom')
      el-table-column(prop='cellphone', label='tel', sortable='custom')
    //- div {{selection}}
</template>

<script>
  import dataTables from '@/index.js'

  export default {
    components: {dataTables},
    data() {
      return {
        tableData: [],
        tableProps: {
          rowClassName: 'test-class',
          border: false,
          stripe: false,
          defaultSort: {
            prop: 'flow_no',
            order: 'descending'
          }
        },
        customFilter: {
          vals: ''
        },
        selection: {},
        actionsDef: {
          colProps: {
            span: 5
          },
          def: [{
            name: 'new',
            handler: () => {
              this.$message('new clicked')
            },
            icon: 'plus',
            buttonProps: {
              type: 'primary'
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
          colProps: {
            span: 6
          },
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
        },
        searchDef: {
          colProps: {
            offset: 2
          },
          props: ['flow_no', 'state_code']
        },
        actionColDef: {
          minWidth: '200',
          def: [{
            handler: row => {
              this.$message('Edit clicked')
              console.log('Edit in row clicked', row)
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
        },
        paginationDef: {
          layout: 'prev, pager, next, jumper, sizes, total'
        }
      }
    },
    created() {
      console.log('created')
      for (var i = 0; i < 100; i++) {
        this.tableData = this.tableData.concat([{
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
          'flow_no': 'FW201601010003',
          'flow_type': 'Help',
          'flow_type_code': 'help',
          'id': '2222222',
          'room_id': '00601',
          'room_no': '601',
          'state': 'Closed',
          'state_code': 'closed'
        }])
      }
    },
    methods: {
      handleSelectChange(selection) {
        this.selection = selection
        console.log(selection)
      },

      handleRowClick() {
        console.log('clicked')
      }
    }
  }
</script>
