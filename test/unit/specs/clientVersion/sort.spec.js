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

  it('customize sort method', done => {
    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :sort-method="sortMethod">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData: [{
            "name": "王小虎",
            "flow_no": "FW201601010001",
            "flow_type": "Repair",
          },
          {
            "name": "李小虎",
            "flow_no": "FW201601010002",
            "flow_type": "Repair",
          },
          {
            "name": "罗小虎",
            "flow_no": "FW201601010003",
            "flow_type": "Repair",
          },
          {
            "name": "张小虎",
            "flow_no": "FW201601010004",
            "flow_type": "Repair",
          }],
          titles: [{
            prop: "flow_no",
            label: "NO."
          }, {
            prop: "name",
            label: "Name"
          }, {
            prop: "flow_type",
            label: "Type"
          }]
        }
      },
      methods: {
        sortMethod(a, b) {
          let map = {
            '王小虎': 3,
            '李小虎': 1,
            '罗小虎': 2,
            '张小虎': 4
          }

          return map[a] > map[b] ? 1 : -1
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
        ths[1].click()

        await sleep(DELAY)
        body = getBody(vm.$el)
        trs = body.querySelectorAll('tr')
        trs[0].querySelector('td .cell').should.have.text('FW201601010002')
        trs[1].querySelector('td .cell').should.have.text('FW201601010003')
        trs[2].querySelector('td .cell').should.have.text('FW201601010001')
        trs[3].querySelector('td .cell').should.have.text('FW201601010004')

        ths[1].click()
        await sleep(DELAY)
        body = getBody(vm.$el)
        trs = body.querySelectorAll('tr')
        trs[0].querySelector('td .cell').should.have.text('FW201601010004')
        trs[1].querySelector('td .cell').should.have.text('FW201601010001')
        trs[2].querySelector('td .cell').should.have.text('FW201601010003')
        trs[3].querySelector('td .cell').should.have.text('FW201601010002')

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
