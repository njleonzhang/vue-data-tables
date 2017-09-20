import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'
import Vue from 'vue'

describe('server render table', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('shoule render correct content', done => {
    let bus = new Vue()
    vm = createVue({
      template: `
        <data-tables-server 
        :data="tableData"
        :load-data="loadData" 
        :total="total"
        @load-data-success='loadDataSuccess'
        @load-data-fail='loadDataFail'
        @query-change='queryChange'
        ref="dataTable">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          total: 0
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data, info) {
          this.tableData = data.data
          this.total = data.total
          bus.$emit('success', data, info)
        },
        loadDataFail(error) {
          console.log(error)
        },
        queryChange(info) {
          bus.$emit('info', info)
        }
      }
    }, true)

    setTimeout(_ => {
      let {table, head, rows} = getTableItems(vm.$el)
      rows.length.should.equal(20)
      let secondItem = rows[1]
      let secondItemTds = secondItem.querySelectorAll('td')
      secondItemTds[0].innerText.should.contains('FW201601010001')
      rows[19].querySelectorAll('td')[0].innerText.should.contains('FW2016010100019')
      head.querySelectorAll('th')[9].innerText.should.not.contains('操作')
      should.not.exist(head.querySelector('td.ascending'))
      table.should.have.class('el-table--border')
      table.should.have.class('el-table--striped')
      destroyVM(vm)
      done()
    }, 500)
  })

  it('no data', done => {
    vm = createVue({
      template: `
        <data-tables-server>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          titles
        }
      },
    }, true)

    setTimeout(_ => {
      let rows = vm.$el.querySelector('tbody').querySelectorAll('tr')
      rows.length.should.equal(0)
      done()
    }, DELAY)
  })
})

describe('data table property', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('hide action', done => {
    vm = createVue({
      template: `
        <data-tables-server :data="tableData" :action-col-def="actionColDef">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          actionColDef: {
            show: false
          }
        }
      },
    }, true)

    setTimeout(_ => {
      // include a width0 column seems from element
      let head = getHead(vm.$el)
      head.querySelectorAll('th').length.should.equal(10)
      vm.$el.querySelector('thead').querySelectorAll('th')[9].innerText.should.equal("")
      done()
    })
  })

  it('tableProps', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server 
        :data="tableData" 
        :tableProps='tableProps'
        :load-data="loadData" 
        :total="total"
        @load-data-success='loadDataSuccess'
        @load-data-fail='loadDataFail'
        @query-change='queryChange'>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          total: 0,
          tableProps: {
            border: false,
            stripe: false,
            defaultSort: {
              prop: 'flow_no',
              order: 'descending'
            }
          }
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data, info) {
          this.tableData = data.data
          this.total = data.total
          bus.$emit('success', data, info)
        },
        loadDataFail(error) {
          console.log(error)
        },
        queryChange(info) {
          bus.$emit('info', info)
        }
      }
    }, true)

    bus.$once('info', info => {
      try {
        info.sortInfo.order.should.equal("descending")
        info.sortInfo.prop.should.equal("flow_no")
        info.type.should.equal("sortChange")
        let table = getTable(vm.$el)
        table.should.not.have.class('el-table--border')
        table.should.not.have.class('el-table--striped')
        let head = getHead(table)
        setTimeout(_ => {
          try {
            head.querySelectorAll('th')[0].should.have.class('descending')
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        }, 200)
        done()
      } catch (e) {
        done({
          message: e.message,
          stack: e.stack
        })
      }
    })
  })
})
