import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'
import Vue from 'vue'

describe('server sort data', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let bus = new Vue()
  it('sort', done => {
    vm = createVue({
      template: `
        <data-tables-server :data="tableData"
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

    let test = async function() {
      try {
        await sleep(DELAY)
        let body = getBody(vm.$el)
        let trs = body.querySelectorAll('tr')
        let ths = vm.$el.querySelectorAll('th')

        await sleep(300)

        bus.$once('success', (data, info) => {
          try {
            data.req.sortInfo.order.should.equal("ascending")
            data.req.sortInfo.prop.should.equal("flow_type")
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.sortInfo.order.should.equal("ascending")
            info.sortInfo.prop.should.equal("flow_type")
            info.type.should.equal("sortChange")
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        ths[4].click()
      } catch (e) {
        console.log(e)
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()

  })
})
