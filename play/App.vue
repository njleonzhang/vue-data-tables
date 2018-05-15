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
      layout='pagination, table, tool',
      :data='serverData',
      loading-str='loading...',
      :total='total',
      :loading='loading',
      :filters='customFilters'
      @query-change='loadData')
        el-row(slot='tool-bar')
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
            el-input(class='test', v-model='customFilters[0].value')
          el-col(:span='5')
            el-select(v-model='customFilters[1].value', multiple)
              el-option(label='维修', value='repair')
              el-option(label='帮忙', value='help')

        el-table-column(prop='flow_no', label='No.', sortable='custom')
        el-table-column(prop='content', label='Content', sortable='custom')
        el-table-column(prop='create_time', label='Time', sortable='custom')
        el-table-column(prop='state', label='State', sortable='custom')
        el-table-column(prop='flow_type', label='Type', sortable='custom')

    //- data-tables(
      :data='tableData',
      :tableProps='tableProps',
      :pagination-def='paginationDef',
      :filters='customFilters',
      )

      el-row(slot='tool-bar')
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
          el-input(class='test', v-model='customFilters[0].value')
        el-col(:span='5')
          el-select(v-model='customFilters[1].value', multiple)
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
</template>

<script>
  import { DataTables, DataTablesServer } from '@/index.js'
  import { mockServer } from '../test/unit/tools/source'
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
          prop: ['flow_no'],
          value: ''
        }, {
          value: []
        }],
        actionColDef: {
          minWidth: '200',
          def: [{
            buttonProps: {
              type: 'primary'
            },
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
        total: 0,
        loading: false
      }
    },
    created() {
      console.log('created')
      for (var i = 0; i < 100; i++) {
        this.serverData = this.tableData = this.tableData.concat([{
          'building': '5',
          'building_group': 'North',
          'cellphone': '13400000000',
          'content': 'Water flood',
          'create_time': '2016-10-01 22:25',
          'flow_no': `FW20160101000${i}`,
          'flow_type': i % 2 === 1 ? 'Repair' : 'Help',
          'flow_type_code': i % 2 === 1 ? 'repair' : 'help',
          'id': '111111',
          'room_id': '00501',
          'room_no': '501',
          'state': 'Created',
          'state_code': 'created'
        }])
      }
      this.total = this.serverData.length
    },
    methods: {
      async loadData(queryInfo) {
        this.loading = true
        await mockServer(queryInfo, 2000)
        this.loading = false
      },
    }
  }
</script>
