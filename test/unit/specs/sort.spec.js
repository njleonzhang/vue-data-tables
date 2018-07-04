import { data, titles, http } from '../tools/source'
import { destroyVM, createVue, getTableItems, sleep, nextTick } from '../tools/utils'

describe('client sort table render', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('basic sort render', async () => {
    vm = createVue({
      template: `
        <data-tables
          :data='data'
          :table-props='tableProps'>
          <el-table-column v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop'
            sortable='custom' />
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles,
          defaultSort: {
            prop: 'flow_type',
            order: 'descending'
          }
        }
      },
    }, true)
    await nextTick(vm)
    let { head } = getTableItems(vm)
    let th = head.find('tr').findAll('th')

    for (let i = 0; i < 5; i++) {
      await nextTick(vm)
      th.at(0).click()
    }

    await nextTick(vm)
    let currentRows = getTableItems(vm).rows
    let currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(0).should.contain.text('FW201601010003')

    for (let i = 0; i < 2; i++) {
      await nextTick(vm)
      th.at(0).click()
    }
    await nextTick(vm)
    currentRows = getTableItems(vm).rows
    currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(2).should.contain.text('Repair')
  })
  it('custom sort render', async () => {
    vm = createVue({
      template: `
        <data-tables
          :data='data'
          :sort-method='sortMethod'>
          <el-table-column v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop'
            sortable='custom' />
        </data-tables>
      `,
      data() {
        return {
          data: [{
            'content': '王小虎',
            'flow_no': 'FW201601010002',
            'flow_type': 'Repair'
          },
          {
            'content': '李小虎',
            'flow_no': 'FW201601010001',
            'flow_type': 'Repair'
          },
          {
            'content': '罗小虎',
            'flow_no': 'FW201601010004',
            'flow_type': 'Repair'
          },
          {
            'content': '张小虎',
            'flow_no': 'FW201601010003',
            'flow_type': 'Repair'
          }],
          titles,
          sortMethod: {
            content(a, b) {
              // for Chinese
              let collator = new Intl.Collator(['zh-Hans-CN', 'zh-CN'])
              let flag = a - b
              return Number.isNaN(flag) ? collator.compare(a, b) : flag
            }
          }
        }
      },
    }, true)
    await sleep(300)
    let { head } = getTableItems(vm)
    let th = head.find('tr').findAll('th')

    th.at(1).click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    let firstRow = rows.at(0)
    firstRow.findAll('td').at(1).should.contain.text('李小虎')

    th.at(1).click()
    await nextTick(vm)
    let currentRows = getTableItems(vm).rows
    let currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(1).should.contain.text('张小虎')
  })
  it('change sort rules render', async () => {
    vm = createVue({
      template: `
        <data-tables
          :data='data'
          :table-props='tableProps'
          :sort-method='sortMethod'>
          <el-table-column v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop'
            sortable='custom' />
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles,
          sortMethod: {
            flow_no(a, b) {
              if (a > b) {
                return 1
              } else if (a < b) {
                return -1
              } else {
                return 0
              }
            }
          }
        }
      },
    }, true)
    await nextTick(vm)
    let { head } = getTableItems(vm)
    let th = head.find('tr').findAll('th')

    for (let i = 0; i < 3; i++) {
      await nextTick(vm)
      th.at(0).click()
    }
    await nextTick(vm)
    let currentRows = getTableItems(vm).rows
    let currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(0).should.contain.text('FW201601010001')
    vm.$data.sortMethod = {
      flow_no(a, b) {
        if (a > b) {
          return -1
        } else if (a < b) {
          return 1
        } else {
          return 0
        }
      }
    }
    await nextTick(vm)
    for (let i = 0; i < 5; i++) {
      await nextTick(vm)
      th.at(0).click()
    }
    await nextTick(vm)
    currentRows = getTableItems(vm).rows
    currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(0).should.contain.text('FW201601010001')
  })
})

describe('server sort table render', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('server sort table render', async () => {
    vm = createVue({
      template: `
        <data-tables-server
          ref='server'
          :data="data"
          :loading="loading"
          :total="total"
          @query-change="loadData">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.label"
            sortable="custom">
          </el-table-column>
        </data-tables-server>
        `,
      data() {
        return {
          data: [],
          titles,
          total: 0,
          loading: false,
        }
      },
      methods: {
        async loadData(queryInfo) {
          queryInfo.type === 'sort' && this.$message(`prop: ${queryInfo.sort.prop}, order: ${queryInfo.sort.order}`)
          let { data, total } = await http(queryInfo)
          this.data = data
          this.total = total
        }
      }
    }, true)
    await sleep(1000)
    let { head } = getTableItems(vm)
    let th = head.find('tr').findAll('th')

    th.at(0).click()
    await sleep(500)
    let currentRows = getTableItems(vm).rows
    let currentFirstRow = currentRows.at(0)
    currentFirstRow.findAll('td').at(0).should.contain.text('FW201601010000')
    currentFirstRow.findAll('td').at(1).should.contain.text('Lock broken0')
    let currentThirdRow = currentRows.at(2)
    currentThirdRow.findAll('td').at(0).should.contain.text('FW2016010100010')
    currentThirdRow.findAll('td').at(1).should.contain.text('Lock broken10')
  })
})
