<style lang='scss'>
  .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }
</style>

<template lang='pug'>
  #app
    el-card
      .desc
        h1 基本用法
        p  checkbox-filter-def: 来定义选择过滤的控件
        p  actions-def: 来定义表格内容
        p  row-action-def: 定义表里各列的操作
        p  action-col-width: 定义动作列的最小宽度
        p  row-click: 行被点击的事件
      data-tables(
        :data='tableData',
        :checkbox-filter-def='getCheckFilterDef()',
        :actions-def='getActionsDef()',
        :row-action-def='getRowActionsDef()',
        action-col-width='200'
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

    el-card
      .desc
        h1 隐藏action列
        p  has-action-col: false，隐藏动作栏

        h1 定义搜索框
        p search-def: 来定义选择过滤的控件

      data-tables(
        :data='tableData1',
        :has-action-col='false',
        :search-def='getSearchDef()',
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

    el-card
      .desc
        p  col-not-row-click: 让某些列不能触发行点击事件，比如action列，里面有很多button，点击这些button的时候可能不小心点击到td，通过这个属性，设置一些列，则这些列不会触发行点击事件。action列默认不会触发行点击事件

      data-tables(
        :data='tableData1',
        :col-not-row-click='["flow_no", "create_time"]',
        :row-action-def='getRowActionsDef()',
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

    el-card
      .desc
        p  pagination-def: 自定义pagination的初始值

      data-tables(
        :data='tableData1',
        :row-action-def='getRowActionsDef()',
        :pagination-def='getPaginationDef()',
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

    el-card
      .desc
        p 事件 (https://github.com/njleonzhang/vue-data-tables#event)
        p 多数的事件都是对element-ui el-table事件的proxy
        p filtered-data事件用于传递过滤后数据，配合alasql(https://github.com/agershun/alasql)等库使用可以实现导出excel等功能
        data-tables(
          :data='tableData1',
          :col-not-row-click='["special_selection_col"]',
          @row-click='rowClick',
          @select='handleSelect',
          @select-all='handleAllSelect',
          @current-change='handleCurrentRowChange',
          @filtered-data='handleFilterDataChange')
          el-table-column(type='selection', width='55', prop='special_selection_col')
          el-table-column(prop='flow_no', label='服务编号', sortable='custom')
          el-table-column(prop='content', label='服务内容', sortable='custom')
          el-table-column(prop='create_time', label='服务时间', sortable='custom')
          el-table-column(prop='state', label='服务状态', sortable='custom')
          el-table-column(prop='flow_type', label='服务类型', sortable='custom')
          el-table-column(prop='building_group', label='分区', sortable='custom')
          el-table-column(prop='building', label='楼栋', sortable='custom')
          el-table-column(prop='room_no', label='房号', sortable='custom')
          el-table-column(prop='cellphone', label='手机号', sortable='custom')

    el-card
      .desc
        h1 高级用法：自定义过滤方法。
        p 也许默认的过滤方法不适合你，那么你可以自定义过滤方法。checkbox-filter-def和search-def都有一个filterFunction属性，定义一个函数即可。本例设定的过滤方案是: 过滤state_code值等于搜索栏的值。所以在搜索栏输入created时可以显示未处理的数据
      data-tables(
        :data='tableData1',
        :checkbox-filter-def='getCheckFilterDef()',
        :row-action-def='getRowActionsDef()',
        :search-def='getSearchDef1()',
        action-col-width='200'
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
      tableData: []
    }
  },

  created() {
    this.tableData1 = mockData.list
    for (var i = 0; i < 100; i++) {
      this.tableData = this.tableData.concat(mockData.list)
    }
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
          'name': '未处理'
        }, {
          'code': 'assigned',
          'name': '已派工'
        }, {
          'code': 'accepted',
          'name': '已接单'
        }, {
          'code': 'closed',
          'name': '已结束'
        }, {
          'code': 'cancelled',
          'name': '已取消'
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
    },
    rowClick(row) {
      this.$message('row clicked')
      console.log('row clicked', row)
    },
    handleSelect(selection, row) {
      console.log('handleSelect', selection, row)
    },
    handleAllSelect(selection) {
      console.log('handleAllSelect', selection)
    },
    handleCurrentRowChange(currentRow, oldCurrentRow) {
      console.log('handleCurrentRowChange', currentRow, oldCurrentRow)
    },
    handleFilterDataChange(filteredData) {
      console.log('handleFilterDataChange', filteredData)
    },
    getSearchDef() {
      return {
        offset: 12,
        props: ['state', 'flow_type'] // can be string or Array
      }
    },
    getSearchDef1() {
      return {
        offset: 12,
        filterFunction(el, filter) {
          return filter.val === el.state_code
        }
      }
    },
    getPaginationDef() {
      return {
        layout: 'total, prev, pager, next, jumper, sizes',
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      }
    }
  }
}
</script>
