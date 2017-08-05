<style lang='scss'>
  .desc {
    margin-top: 20px;
    margin-bottom: 40px;
  }

  .pl {
    padding-left: 20px;
  }
</style>

<template lang='pug'>
  #app
    el-card
      a(href='https://github.com/njleonzhang/vue-data-tables/blob/1.x/example/docs/en.vue', target='_blank') compare to the source code

    el-card
      .desc
        H1 Basic usage
      data-tables(
        :data='tableData',
        :checkbox-filter-def='getCheckFilterDef()',
        :actions-def='getActionsDef()',
        :row-action-def='getRowActionsDef()',
        action-col-width='200'
        action-col-label='Actions'
        @row-click='rowClick')
        el-table-column(prop='flow_no', label='No.', sortable='custom')
        el-table-column(prop='content', label='Content', sortable='custom')
        el-table-column(prop='create_time', label='Time', sortable='custom')
        el-table-column(prop='state', label='State', sortable='custom')
        el-table-column(prop='flow_type', label='Type', sortable='custom')
        el-table-column(prop='building_group', label='Building group', sortable='custom')
        el-table-column(prop='building', label='building', sortable='custom')
        el-table-column(prop='room_no', label='no', sortable='custom')
        el-table-column(prop='cellphone', label='tel', sortable='custom')

    el-card
      .desc
        p Show only search box and customize it.
      data-tables(
        :data='tableData1',
        :has-action-col='false',
        :search-def='getSearchDef()',
        action-col-label='Actions'
        @row-click='rowClick')
        el-table-column(prop='flow_no', label='No.', sortable='custom')
        el-table-column(prop='content', label='Content', sortable='custom')
        el-table-column(prop='create_time', label='Time', sortable='custom')
        el-table-column(prop='state', label='State', sortable='custom')
        el-table-column(prop='flow_type', label='Type', sortable='custom')
        el-table-column(prop='building_group', label='Building group', sortable='custom')
        el-table-column(prop='building', label='building', sortable='custom')
        el-table-column(prop='room_no', label='no', sortable='custom')
        el-table-column(prop='cellphone', label='tel', sortable='custom')

    el-card
      .desc
        p  col-not-row-click: [String | Array] make some columns not trigger row click. For example, In <b>action column</b>, there are lots of buttons. when you click these buttons, you sometimes may click the td element, which will cause row click event. By this property, we can indicate the columns, which you don't want them to trigger row click.
        p <b>action column</b> is mark as <b>not trigger click</b> by deault.
        p In this sample, column <b>No.</b> and <b>Time</b> are indiacated.

      data-tables(
        :data='tableData1',
        :col-not-row-click='["flow_no", "create_time"]',
        :row-action-def='getRowActionsDef()',
        action-col-label='Actions'
        @row-click='rowClick')
        el-table-column(prop='flow_no', label='No.', sortable='custom')
        el-table-column(prop='content', label='Content', sortable='custom')
        el-table-column(prop='create_time', label='Time', sortable='custom')
        el-table-column(prop='state', label='State', sortable='custom')
        el-table-column(prop='flow_type', label='Type', sortable='custom')
        el-table-column(prop='building_group', label='Building group', sortable='custom')
        el-table-column(prop='building', label='building', sortable='custom')
        el-table-column(prop='room_no', label='no', sortable='custom')
        el-table-column(prop='cellphone', label='tel', sortable='custom')

    el-card
      .desc
        H1 customize pagination

      data-tables(
        :data='tableData1',
        :row-action-def='getRowActionsDef()',
        :pagination-def='getPaginationDef()',
        action-col-label='Actions'
        @row-click='rowClick')
        el-table-column(prop='flow_no', label='No.', sortable='custom')
        el-table-column(prop='content', label='Content', sortable='custom')
        el-table-column(prop='create_time', label='Time', sortable='custom')
        el-table-column(prop='state', label='State', sortable='custom')
        el-table-column(prop='flow_type', label='Type', sortable='custom')
        el-table-column(prop='building_group', label='Building group', sortable='custom')
        el-table-column(prop='building', label='building', sortable='custom')
        el-table-column(prop='room_no', label='no', sortable='custom')
        el-table-column(prop='cellphone', label='tel', sortable='custom')

    el-card
      .desc
        h1
          a(href='https://github.com/njleonzhang/vue-data-tables#event') Event
        p most of the events is just a proxy for element-ui el-table.
        p filtered-data is special, which pass the filted data out the component.
        p you can export these data to excel by 3rd-party libs, such as:
          a(href='https://github.com/zemirco/json2csv') json2csv
          span 、
          a(href='https://github.com/agershun/alasql') alasql

        data-tables(
          :data='tableData1',
          :actions-def='getExportActionsDef()',
          @row-click='rowClick',
          @select='handleSelect',
          @select-all='handleAllSelect',
          @current-change='handleCurrentRowChange',
          action-col-label='Actions'
          @filtered-data='handleFilterDataChange')
          el-table-column(prop='flow_no', label='No.', sortable='custom')
          el-table-column(prop='content', label='Content', sortable='custom')
          el-table-column(prop='create_time', label='Time', sortable='custom')
          el-table-column(prop='state', label='State', sortable='custom')
          el-table-column(prop='flow_type', label='Type', sortable='custom')
          el-table-column(prop='building_group', label='Building group', sortable='custom')
          el-table-column(prop='building', label='building', sortable='custom')
          el-table-column(prop='room_no', label='no', sortable='custom')
          el-table-column(prop='cellphone', label='tel', sortable='custom')

    el-card
      .desc
        h1 Customize filter function
        p Sometimes, the default filter function can not work in your scenario. <b>checkbox-filter-def</b> and <b>search-def</b> both has a property called <b>filterFunction</b>, you can defined your customize filter functions.
        p In this sample, the filter is that show rows whose <b>state_code</b> equals the string in the search box. so if you input <b>created</b> in search box, the table show all rows which are in <b>created</b> state.

      data-tables(
        :data='tableData1',
        :checkbox-filter-def='getCheckFilterDef()',
        :row-action-def='getRowActionsDef()',
        :search-def='getSearchDef1()',
        action-col-width='200'
        action-col-label='Actions'
        @row-click='rowClick')
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
import DataTables from '../../src/index.js'
import {en} from '../mock'
import CsvExport from '../utils/CsvExport'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

export default {
  name: 'app',
  components: {
    DataTables
  },

  data() {
    return {
      tableData: [],
      tableData1: [],
      filteredData: []
    }
  },

  created() {
    this.tableData1 = en
    for (var i = 0; i < 100; i++) {
      this.tableData = this.tableData.concat(en)
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
    },

    getExportActionsDef() {
      let columns = ['room_no', 'cellphone', 'flow_no', 'state']
      let columnNames = ['room NO.', 'Tel.', 'order No.', 'state']

      return {
        width: 19,
        def: [{
          name: 'export all',
          handler: () => {
            CsvExport(this.tableData1, columns, columnNames, 'all')
          },
          icon: 'plus'
        }, {
          name: 'export filtered',
          handler: () => {
            CsvExport(this.filteredData, columns, columnNames, 'filtered')
          },
          icon: 'upload'
        }]
      }
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
      this.filteredData = filteredData
    },
    getSearchDef() {
      return {
        offset: 12,
        placeholder: 'please input searchkey',
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
