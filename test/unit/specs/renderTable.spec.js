import { data, titles, http } from '../tools/source'
import { destroyVM, createVue, getTableItems, sleep } from '../tools/utils'

let renderTableProps = function(vm) {
  let { table, head } = getTableItems(vm)
  table.should.have.class('el-table--border')
  table.should.have.class('el-table--striped')
  head.findAll('th').at(0).should.have.class('descending')
}

let renderEmptyTable = function(vm) {
  let { rows } = getTableItems(vm)
  rows.should.have.length(0)
}

describe('client render table', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('should render correct content', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data'>
          <el-table-column v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop' sortable='custom'/>
        </data-tables>
      `,
      data() {
        return { data: data(), titles }
      },
    }, true)

    await sleep(1000)

    let { rows } = getTableItems(vm)
    rows.should.have.length(3)
    let firstRow = rows.at(0)
    let secondRow = rows.at(1)
    let thirdRow = rows.at(2)
    firstRow.findAll('td').at(0).should.contain.text('FW201601010001')
    secondRow.findAll('td').at(1).should.contain.text('Lock broken')
    thirdRow.findAll('td').at(2).should.contain.text('Help')
  })

  // no data render
  it('no data', async () => {
    vm = createVue({
      template: `
        <data-tables>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return { titles }
      }
    })
    await sleep(1000)
    renderEmptyTable(vm)
  }, true)

  it('table props', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :table-props='tableProps'>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles,
          tableProps: {
            border: true,
            stripe: true,
            rowClassName: 'test-class',
            'elementLoadingText': '拼命加载中',
            'elementLoadingSpinner': 'el-icon-loading',
            'elementLoadingBackground': 'rgba(0, 0, 0, 0.8)',
            defaultSort: {
              prop: 'flow_no',
              order: 'descending'
            }
          }
        }
      }
    })
    await sleep(1000)
    renderTableProps(vm)
  })
})

describe('server table render', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('should render server table correct content', async () => {
    vm = createVue({
      template: `
        <data-tables-server
          ref='server'
          :data="data"
           :loading="loading"
          :total="total"
          @query-change="loadData"
        >
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.label">
          </el-table-column>
        </data-tables-server>
        `,
      data() {
        return { data: [], titles, total: 0, loading: false }
      },
      methods: {
        async loadData(queryInfo) {
          this.loading = true
          let { data, total } = await http(queryInfo)
          this.data = data
          this.total = total
          this.loading = false
        }
      }
    }, true)
    await sleep(1000)

    let { rows } = getTableItems(vm)
    rows.should.have.length(20)
    let secondItem = rows.at(1)
    let secondItemTds = secondItem.findAll('td')
    secondItemTds.at(0).should.have.text('FW201601010001')
  })

  it('no data', async () => {
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
    await sleep(1000)
    renderEmptyTable(vm)
  })

  it('table props', async () => {
    vm = createVue({
      template: `
        <data-tables-server :data='data' :table-props='tableProps'>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          data: data(),
          titles,
          tableProps: {
            border: true,
            stripe: true,
            defaultSort: {
              prop: 'flow_no',
              order: 'descending'
            }
          }
        }
      }
    })
    await sleep(1000)
    renderTableProps(vm)
  })
})
