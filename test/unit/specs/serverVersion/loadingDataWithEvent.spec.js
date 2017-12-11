import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer, mockServerError} from '../../tools/source'
import Vue from 'vue'

describe('server loading with event', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('load without loadData', function(done) {
    this.timeout(5000)
    const bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          :loading="loading"
          :total="total"
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
          tableData: [],
          titles,
          loading: false,
          total: 0
        }
      },
      created() {
        this.loadData(500, {
          page: 1,
          pageSize: 20
        })
      },
      methods: {
        loadData(time = 200, info) {
          setTimeout(_ => {
            bus.$emit('loading-data', info)
          }, time)
        },
        queryChange(info) {
          this.loadData(DELAY, info)
        }
      }
    }, true)

    let test = async function() {
      bus.$once('loading-data', async info => {
        vm.loading = true
        await sleep(DELAY)
        const mask = vm.$el.querySelector('.el-loading-mask')
        let body = getBody(vm.$el)

        mask.should.be.displayed

        let { data, total } = await mockServer(info, DELAY)
        vm.tableData = data
        vm.total = total
        vm.loading = false

        await sleep(1000) // why it need 1s to refresh to page?
        mask.should.not.be.displayed

        body.querySelectorAll('tr').length.should.equal(20)

        bus.$once('loading-data', async info => {
          let { data, total } = await mockServer(info, DELAY)
          vm.tableData = data
          vm.total = total
          await sleep(DELAY)
          body.querySelectorAll('tr').length.should.equal(50)
          done()
        })

        let pagination = vm.$el.querySelector('.el-pagination')
        let select = pagination.querySelector('.el-select')
        select.click()
        sleep(DELAY)
        let selectItems = pagination.querySelectorAll('.el-select-dropdown__item')
        await sleep(DELAY)
        selectItems[1].click()
      })
    }
    test()
  })
})
