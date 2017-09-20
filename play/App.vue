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
    data-tables-server(
    :data='serverData',
    loading-str='loading...',
    :total='total',
    :show-action-bar='false',
    :actions-def='actionsDef',
    :checkbox-filter-def='checkFilterDef',
    :load-data='loadData',
    :custom-filters='customFilters',
    @load-data-success='loadDataSuccess',
    @load-data-fail='loadDataFail')
      el-row(slot='custom-tool-bar')
        el-col(:span='5')
          el-dropdown
            el-button(type='primary')
              | 更多菜单
              i.el-icon-caret-bottom.el-icon--right
            el-dropdown-menu(slot='dropdown')
              el-dropdown-item 黄金糕
              el-dropdown-item 狮子头
              el-dropdown-item 螺蛳粉
              el-dropdown-item 双皮奶
              el-dropdown-item 蚵仔煎
        el-col(:span='14')
          el-input(class='test', v-model='customFilters[0].vals')
        el-col(:span='5')
          el-select(v-model='customFilters[1].vals', multiple)
            el-option(label='维修', value='repair')
            el-option(label='帮忙', value='help')

      el-table-column(prop='flow_no', label='No.', sortable='custom')
      el-table-column(prop='content', label='Content', sortable='custom')
      el-table-column(prop='create_time', label='Time', sortable='custom')
      el-table-column(prop='state', label='State', sortable='custom')
      el-table-column(prop='flow_type', label='Type', sortable='custom')

    data-tables(
      :data='tableData',
      :show-action-bar='false',
      :actions-def='actionsDef',
      :checkbox-filter-def='checkFilterDef',
      :search-def='searchDef',
      :action-col-def='actionColDef',
      :custom-filters='customFilters',
      :tableProps='tableProps',
      :pagination-def='paginationDef')

      el-row(slot='custom-tool-bar')
        el-col(:span='5')
          el-dropdown
            el-button(type='primary')
              | 更多菜单
              i.el-icon-caret-bottom.el-icon--right
            el-dropdown-menu(slot='dropdown')
              el-dropdown-item 黄金糕
              el-dropdown-item 狮子头
              el-dropdown-item 螺蛳粉
              el-dropdown-item 双皮奶
              el-dropdown-item 蚵仔煎

        el-col(:span='14')
          el-input(class='test', v-model='customFilters[0].vals')
        el-col(:span='5')
          el-select(v-model='customFilters[1].vals', multiple)
            el-option(label='维修', value='repair')
            el-option(label='帮忙', value='help')

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
  import {DataTables, DataTablesServer} from '@/index.js'
  import {mockServer} from '../test/unit/tools/source'
  export default {
    components: {
      DataTables,
      DataTablesServer
    },
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
        customFilters: [{
          props: ['flow_no', 'flow'],
          vals: ''
        }, {
          vals: []
        }],
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
        },
        serverData: [],
        total: 0
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
      loadData(queryInfo) {
        return mockServer(queryInfo, 2000)
      },
      loadDataSuccess(data) {
        this.serverData = data.data
        this.total = data.total
      },
      loadDataFail(error) {
        console.log(error)
      }
    }
  }
</script>
