import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client sort data', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('sort', done => {
    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData,
          titles
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let body = getBody(vm.$el)
        let trs = body.querySelectorAll('tr')

        for (var i = 0; i < trs.length; i++) {
          trs[i].querySelector('td .cell').should.have.text(`FW20160101000` + (i + 1))
        }

        let ths = vm.$el.querySelectorAll('th')
        ths[4].click()

        await sleep(DELAY)
        body = getBody(vm.$el)
        trs = body.querySelectorAll('tr')
        trs[0].querySelector('td .cell').should.have.text('FW201601010003')
        trs[1].querySelector('td .cell').should.have.text('FW201601010001')
        trs[2].querySelector('td .cell').should.have.text('FW201601010002')

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
