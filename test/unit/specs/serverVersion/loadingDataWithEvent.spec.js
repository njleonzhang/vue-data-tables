import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer, mockServerError} from '../../tools/source'

describe('server loading with event', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('load without loadData', function(done) {
    this.timeout(5000)

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
        setTimeout(_ => {
          this.loadData({
            page: 1,
            pageSize: 20
          })
        }, 1000)
      },
      methods: {
        loadData(info) {
          this.loading = true
          mockServer(info, 1000)
            .then(data => {
              this.tableData = data.data
              this.total = data.total
              this.loading = false
            })
            .catch(error => {
              console.log(error)
              this.loading = false
            })
        },
        queryChange(info) {
          this.loadData(info)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(1500)
        let loading = document.querySelector('.el-loading-mask')
        loading.should.be.displayed
        await sleep(1500)
        loading.should.not.be.displayed

        let body = getBody(vm.$el)
        body.querySelectorAll('tr').length.should.equal(20)

        let pagination = vm.$el.querySelector('.el-pagination')
        let select = pagination.querySelector('.el-select')
        select.click()
        sleep(DELAY)
        let selectItems = pagination.querySelectorAll('.el-select-dropdown__item')
        selectItems[1].click()
        await sleep(1500)
        body.querySelectorAll('tr').length.should.equal(50)
        done()
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
