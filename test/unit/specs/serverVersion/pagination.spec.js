import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'
import Vue from 'vue'

describe('server pagination def', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('pagination', done => {
    vm = createVue({
      template: `
        <data-tables-server 
          :data="tableData" 
          :pagination-def="paginationDef"
          :load-data="loadData" 
          @load-data-success='loadDataSuccess'
          @load-data-fail='loadDataFail'
          @query-change='queryChange'
          ref="dataTable">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom">
          </el-table-column>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          paginationDef: {
            pageSize: 1,
            pageSizes: [1, 2, 3],
            currentPage: 2
          }
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data) {
          this.tableData = data.data
          this.total = data.total
        },
        loadDataFail(error) {
          console.log(error)
        },
        queryChange(info) {
        }
      }
    }, true)

    setTimeout(_ => {
      let jump = vm.$el.querySelector('.el-pagination__jump').querySelector('.el-pagination__editor')
      jump.should.have.property('value', '2')
      vm.$refs.dataTable.innerPaginationDef.should.deep.equal({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      })
      done()
    }, DELAY)
  })

  it('pagination is disabled', done => {
    vm = createVue({
      template: `
        <data-tables-server :data="tableData" :paginationDef="paginationDef" ref="dataTable">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom">
          </el-table-column>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          paginationDef: {
            show: false
          }
        }
      }
    }, true)

    setTimeout(_ => {
      let jump = vm.$el.querySelector('.pagination-wrap')
      should.not.exist(jump)

      done()
    }, DELAY)
  })

  it('pagination event', function(done) {
    this.timeout(5000)

    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server :data="tableData"
        :pagination-def="paginationDef"
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
          total: 0,
          paginationDef: {
            pageSize: 10,
            pageSizes: [10, 20, 30],
            currentPage: 2
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

    let test = async function() {
      try {
        await sleep(300)
        let body = getBody(vm.$el)
        body.querySelectorAll('tr').length.should.equal(10)

        let pagination = vm.$el.querySelector('.el-pagination')
        let jump = pagination.querySelector('.el-pagination__jump').querySelector('.el-pagination__editor')
        let select = pagination.querySelector('.el-select')
        select.click()
        await sleep(DELAY)

        let selectItems = pagination.querySelectorAll('.el-select-dropdown__item')

        bus.$once('success', (data, info) => {
          try {
            data.data.length.should.equal(20)
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('sizeChange')
            info.page.should.equal(2)
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        selectItems[1].click()
        await sleep(300)

        jump.focus()
        jump.value = 8

        bus.$once('success', (data, info) => {
          try {
            data.data.length.should.equal(20)
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('pageChange')
            info.page.should.equal(8)
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        triggerEvent(jump, 'change')
      } catch (e) {
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()
  })
})
