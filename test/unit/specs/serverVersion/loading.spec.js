import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer, mockServerError} from '../../tools/source'
import Vue from 'vue'

describe('server loading', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('loading should disappear when error occur', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server 
          :data="tableData" 
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
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServerError(queryInfo)
        },
        loadDataSuccess(data) {
        },
        loadDataFail(error) {
          bus.$emit('error', error)
        },
        queryChange(info) {
        }
      }
    }, true)

    let test = async function() {
      bus.$once('error', (error) => {
        try {
          error.should.equal('network error')
          setTimeout(_ => {
            try {
              loading.should.not.be.displayed
              done()
            } catch (e) {
              done({
                message: e.message,
                stack: e.stack
              })
            }
          }, 1000)
        } catch (e) {
          done({
            message: e.message,
            stack: e.stack
          })
        }
      })

      await sleep(DELAY)
      let loading = vm.$el.querySelector('.el-loading-mask')
      try {
        should.exist(loading)
        loading.should.be.displayed
      } catch (e) {
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()
  })

  it('loading should disappear', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server 
          :data="tableData" 
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
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data) {
          bus.$emit('success')
        },
        loadDataFail(error) {
        },
        queryChange(info) {
        }
      }
    }, true)

    let test = async function() {
      bus.$once('success', _ => {
        try {
          setTimeout(_ => {
            try {
              loading.should.not.be.displayed
              done()
            } catch (e) {
              done({
                message: e.message,
                stack: e.stack
              })
            }
          }, 500)
        } catch (e) {
          done({
            message: e.message,
            stack: e.stack
          })
        }
      })

      await sleep(DELAY)
      let loading = vm.$el.querySelector('.el-loading-mask')
      try {
        should.exist(loading)
        loading.should.be.displayed
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
