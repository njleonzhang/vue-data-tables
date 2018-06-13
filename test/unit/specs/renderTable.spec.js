import { data, titles, http } from '../tools/source'
import { nextTick, createVue, getTableItems, sleep } from '../tools/utils'

describe('client render table', _ => {
  let wrapper
  afterEach(function() {
    wrapper.destroy()
  })

  it('should render correct content', async () => {
    wrapper = createVue({
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
    })

    await nextTick(wrapper.vm)

    let { table, rows } = getTableItems(wrapper)
    rows.length.should.equal(3)
    let firstRow = rows.at(0)
    let firstItemTds = firstRow.findAll('td').at(0)
    let secondItemTds = firstRow.findAll('td').at(1)
    let thirdItemTds = firstRow.findAll('td').at(2)
    firstItemTds.text().should.equal('FW201601010001')
    secondItemTds.text().should.equal('Water flood')
    thirdItemTds.text().should.equal('Repair')
    table.contains('.el-table__header-wrapper').should.equal(true)
  })

  // no data render
  it('no data', async () => {
    wrapper = createVue({
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
    await nextTick(wrapper.vm)
    let { rows } = getTableItems(wrapper)
    rows.length.should.equal(0)
  })

  it('table props', async () => {
    wrapper = createVue({
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
            defaultSort: {
              prop: 'flow_no',
              order: 'descending'
            }
          }
        }
      }
    })
    await nextTick(wrapper.vm)
    let { table, head } = getTableItems(wrapper)
    table.contains('.el-table--border').should.equal(true)
    table.contains('.el-table--striped').should.equal(true)
    head
      .findAll('th')
      .at(0)
      .contains('.descending')
      .should.equal(true)
  })
})

describe('server table render', _ => {
  let wrapper

  afterEach(function() {
    // wrapper.destroy()
  })
  it('should render server table correct content', async () => {
    wrapper = createVue({
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
    })
    await sleep(1000)

    let { rows } = getTableItems(wrapper)
    rows.length.should.equal(20)
    let secondItem = rows.at(1)
    let secondItemTds = secondItem.findAll('td')
    secondItemTds
      .at(0)
      .text()
      .should.equal('FW201601010001')
  })
})
