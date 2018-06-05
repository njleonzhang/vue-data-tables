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

<template>
  <div class="app-wrapper">
    <data-tables-server
      :data="serverData"
      :total="total"
      :loading="loading"
      :filters="customFilters"
      :action-col="actionColDef"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :table-props="tableProps"
      @query-change="loadData">
      <el-row slot="tool">
        <el-col :span="5">
          <el-dropdown>
            <el-button type="primary">更多菜单<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="14">
          <el-input v-model="customFilters[0].value" class="test"></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="customFilters[1].value" multiple="multiple">
            <el-option label="维修" value="repair"></el-option>
            <el-option label="帮忙" value="help"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-table-column prop="flow_no" label="No." sortable="custom"></el-table-column>
      <el-table-column prop="content" label="Content" sortable="custom"></el-table-column>
      <el-table-column prop="create_time" label="Time" sortable="custom"></el-table-column>
      <el-table-column prop="state" label="State" sortable="custom"></el-table-column>
      <el-table-column prop="flow_type" label="Type" sortable="custom"></el-table-column>
    </data-tables-server>
    <data-tables :data="tableData" :tableProps="tableProps" :filters="customFilters">

      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="flow_no" label="No." sortable="custom"></el-table-column>
      <el-table-column prop="content" label="Content" sortable="custom"></el-table-column>
      <el-table-column prop="create_time" label="Time" sortable="custom"></el-table-column>
      <el-table-column prop="state" label="State" sortable="custom"></el-table-column>
      <el-table-column prop="flow_type" label="Type" sortable="custom"></el-table-column>
      <el-table-column prop="building_group" label="Building group" sortable="custom"></el-table-column>
      <el-table-column prop="building" label="building" sortable="custom"></el-table-column>
      <el-table-column prop="room_no" label="no" sortable="custom"></el-table-column>
      <el-table-column prop="cellphone" label="tel" sortable="custom"></el-table-column>
    </data-tables>
  </div>
</template>

<script>
import { DataTables, DataTablesServer } from '@/index.js'
// import { DataTables, DataTablesServer } from 'vue-data-tables/src/index.js'

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
        'elementLoadingText': '拼命加载中',
        'elementLoadingSpinner': 'el-icon-loading',
        'elementLoadingBackground': 'rgba(0, 0, 0, 0.8)',
        defaultSort: {
          prop: 'flow_no',
          order: 'descending'
        }
      },
      customFilters: [{
        prop: ['flow_type_code', 'flow_no'],
        value: '',
        filterFn(el, filter) {
          return el.flow_no === filter.value
        }
      }, {
        prop: 'flow_type_code',
        value: []
      }],
      actionColDef: {
        minWidth: '200',
        items: [{
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
      serverData: [],
      total: 0,
      loading: false,
      currentPage: 2,
      pageSize: 30
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
      console.log(queryInfo)
      this.loading = true
      let { data, total } = await mockServer(queryInfo, 200)
      this.serverData = data
      this.total = total
      this.loading = false
    },
  }
}
</script>
