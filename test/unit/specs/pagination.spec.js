import { data, titles, http } from '../tools/source'
import { destroyVM, createVue, getTableItems, nextTick, simulateEvent, sleep } from '../tools/utils'

let getPaginationItems = function(vm) {
  let paginationBar = vm.$el.find('.pagination-bar')
  return {
    buttons: paginationBar.findAll('button'),
    pageNumber: paginationBar.findAll('.number'),
    inputElm: paginationBar.findAll('input'),
    dropDowns: paginationBar.findAll('.el-select-dropdown__item'),
  }
}

describe('client pagination render', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('client base pagination', async () => {
    vm = createVue({
      template: `
        <data-tables :data="data" :current-page="2" :page-size="1" :pagination-props="{ background: true, pageSizes: [1, 2, 3] }">
          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles
        }
      }
    }, true)
    await nextTick(vm)
    let { buttons, pageNumber, inputElm, dropDowns } = getPaginationItems(vm)

    buttons.at(0).click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('FW201601010001')

    pageNumber.at(1).click()
    await nextTick(vm)
    let currentRows = getTableItems(vm).rows
    currentRows.should.have.length(1)
    let currentFirstRow = rows.at(0)
    let currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(0).should.have.text('FW201601010002')

    simulateEvent(inputElm.at(0), 3, 'change')
    await nextTick(vm)
    currentRows = getTableItems(vm).rows
    currentRows.should.have.length(1)
    currentFirstRow = rows.at(0)
    currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(0).should.have.text('FW201601010003')

    dropDowns.at(2).click()
    await nextTick(vm)
    currentRows = getTableItems(vm).rows
    currentRows.should.have.length(3)
  })
  it('mismatch pagination', async () => {
    vm = createVue({
      template: `
        <data-tables :data="data" :current-page="1" :page-size="2" :pagination-props="{ background: true, pageSizes: [1, 5, 10] }">
          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles
        }
      }
    }, true)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
  })
  it('no pagination', async () => {
    vm = createVue({
      template: `
        <data-tables :data="data" layout="table">
          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles
        }
      }
    }, true)
    await nextTick(vm)
    vm.$el.should.not.contain('.pagination-bar')
  })
})
describe('server pagination render', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('server base pagination', async () => {
    vm = createVue({
      template: `
          <data-tables-server :data="data" :total="total" @query-change="loadData" :pagination-props="{ pageSizes: [5, 10, 20] }">
            <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label" sortable="custom">
            </el-table-column>
          </data-tables-server>
        `,
      data() {
        return {
          data: [],
          titles,
          total: 0,
          innerPageSize: 5
        }
      },
      methods: {
        async loadData(queryInfo) {
          let { data, total } = await http(queryInfo)
          this.data = data
          this.total = total
        }
      }
    }, true)
    await sleep(1000)
    let { rows } = getTableItems(vm)
    rows.should.have.length(20)
    let { buttons, pageNumber, inputElm, dropDowns } = getPaginationItems(vm)
    buttons.at(1).click()
    await sleep(1000)
    let currentRows = getTableItems(vm).rows
    let currentFirstRow = rows.at(0)
    let currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(0).should.have.text('FW2016010100020')

    simulateEvent(inputElm.at(0), 3, 'change')
    await sleep(1000)
    currentRows = getTableItems(vm).rows
    currentFirstRow = rows.at(0)
    currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(0).should.have.text('FW2016010100040')

    pageNumber.at(1).click()
    await sleep(1000)
    currentRows = getTableItems(vm).rows
    currentFirstRow = rows.at(0)
    currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(0).should.have.text('FW2016010100020')

    dropDowns.at(0).click()
    await sleep(1000)
    currentRows = getTableItems(vm).rows
    currentRows.should.have.length(5)
  })
})
