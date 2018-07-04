import { titles, http } from '../tools/source'
import { destroyVM, createVue, getTableItems, nextTick, simulateEvent, sleep } from '../tools/utils'

describe('client checkFilters', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('prop is String && value is not Array', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; to try'></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              prop: 'name',
              value: ''
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)

    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'us', 'input')
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('USA')
  })
  it('prop is String && value is Array', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-checkbox-group v-model='filters[0].value'>
                <el-checkbox label='China' ref='china'></el-checkbox>
                <el-checkbox label='USA' ref='usa'></el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              prop: 'name',
              value: []
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)

    vm.$refs.china.$el.click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('China')

    vm.$refs.usa.$el.click()
    await nextTick(vm)
    let newRows = getTableItems(vm).rows
    newRows.should.have.length(2)
  })
  it('prop is Array && value is not Array', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; to try'></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              prop: ['name', 'rank'],
              value: ''
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(2)
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'us', 'input')
    await nextTick(vm)
    let newRows = getTableItems(vm).rows
    newRows.should.have.length(1)
    let newFirstRow = rows.at(0)
    let newFirstRowTds = newFirstRow.findAll('td')
    newFirstRowTds.at(0).should.have.text('USA')

    simulateEvent(inputElm.at(0), '', 'input')
    await nextTick(vm)

    simulateEvent(inputElm.at(0), 1, 'input')
    await nextTick(vm)
    newRows = getTableItems(vm).rows
    newRows.should.have.length(1)
    newFirstRow = rows.at(0)
    newFirstRowTds = newFirstRow.findAll('td')
    newFirstRowTds.at(0).should.have.text('USA')
  })
  it('prop is Array && value is Array', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-checkbox-group v-model='filters[0].value'>
                <el-checkbox label='China' ref='china'></el-checkbox>
                <el-checkbox label='USA' ref='usa'></el-checkbox>
                <el-checkbox label='Canada' ref='canada'></el-checkbox>
                <el-checkbox label='Russia' ref='russia'></el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', neighbor: 'Canada' },
            { name: 'China', neighbor: 'Russia' }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'neighbor',
            label: 'Neighbor'
          }],
          filters: [
            {
              prop: ['name', 'neighbor'],
              value: []
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)

    vm.$refs.china.$el.click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('China')

    vm.$refs.canada.$el.click()
    await nextTick(vm)
    let newRows = getTableItems(vm).rows
    newRows.should.have.length(2)
    let newFirstRow = newRows.at(0)
    let newFirstRowTds = newFirstRow.findAll('td')
    newFirstRowTds.at(0).should.have.text('USA')
  })
  it('mismatch prop', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-checkbox-group v-model='filters[0].value'>
                <el-checkbox label='China' ref='china'></el-checkbox>
                <el-checkbox label='USA' ref='usa'></el-checkbox>
                <el-checkbox label='Canada' ref='canada'></el-checkbox>
                <el-checkbox label='Russia' ref='russia'></el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', neighbor: 'Canada' },
            { name: 'China', neighbor: 'Russia' }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'neighbor',
            label: 'Neighbor'
          }],
          filters: [
            {
              prop: 'age',
              value: []
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)

    vm.$refs.china.$el.click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(0)
  })
  it('prop is not String or Array', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; to try'></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              prop: {},
              value: {}
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)

    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'us', 'input')
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(0)
  })
  it('prop is undefined', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; to try'></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              value: ''
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')
    simulateEvent(inputElm.at(0), 'us', 'input')

    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('USA')
  })
  it('tableData contains null', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; to try'></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: null, rank: 1 },
            { name: 'China', rank: 2 }
          ],
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }],
          filters: [
            {
              prop: 'name',
              value: ''
            }
          ]
        }
      }
    }, true)
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('')
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'null', 'input')
    await nextTick(vm)
    let currentRow = getTableItems(vm).rows
    currentRow.should.have.length(0)
  })
  it('custom filterProps', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters' :filter-props='setFilterProps ? [&quot;name&quot;, &quot;rank&quot;] : undefined'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='24'>
                <el-checkbox v-model='setFilterProps' ref='setFilterProps'> filterProps</el-checkbox>
            </el-col>
            <el-col :span='10'>
              <el-input v-model='filters[0].value' placeholder='input &quot;us&quot; or &quot;1&quot; to try'></el-input>
            </el-col>

            <el-col :span='10'>
              <el-checkbox-group v-model='filters[1].value'>
                <el-checkbox label='China' ref='china'></el-checkbox>
                <el-checkbox label='USA' ref='usa'></el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-table-column v-for='title in titles' :prop='title.prop' :label='title.label' :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [
            { name: 'USA', rank: 1, members: ['USA', 'China'] },
            { name: 'China', rank: 2, members: ['USA', 'China'] }
          ],
          setFilterProps: true,
          titles: [{
            prop: 'name',
            label: 'Name'
          }, {
            prop: 'rank',
            label: 'Rank'
          }, {
            prop: 'members',
            label: 'Members'
          }],
          filters: [
            {
              value: ''
            },
            {
              value: []
            }
          ]
        }
      },
    }, true)
    await nextTick(vm)

    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(1), 'us', 'input')
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('USA')

    vm.$refs.china.$el.click()
    await nextTick(vm)
    let newRows = getTableItems(vm).rows
    newRows.should.have.length(0)

    vm.$refs.setFilterProps.$el.click()
    await nextTick(vm)
    newRows = getTableItems(vm).rows
    newRows.should.have.length(2)
    simulateEvent(inputElm.at(1), '1', 'input')
    await nextTick(vm)
    newRows = getTableItems(vm).rows
    newRows.should.have.length(1)
  })
  it('use filterFn', async () => {
    vm = createVue({
      template: `
        <data-tables :data='data' :filters='filters'>
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input style='margin-bottom: 10px; width: 200px;' v-model='filters[0].value'></el-input>
            </el-col>
          </el-row>
          <el-table-column prop="flow_no" label="NO." sortable="custom">
          </el-table-column>
          <el-table-column prop="content" label="Content." sortable="custom">
          </el-table-column>
          <el-table-column prop="date" label="Date" sortable="custom">
            <template slot-scope="scope">
              <div>{{getDate(scope.row.date)}}</div>
            </template>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: [{
            'content': 'Water flood',
            'flow_no': 'FW201601010001',
            'date': 'Wed Jul 08 2017 09:18:41 GMT+0800 (CST)'
          }, {
            'content': 'Lock broken',
            'flow_no': 'FW201601010002',
            'date': 'Wed Jul 02 2017 14:19:29 GMT+0800 (CST)'
          }, {
            'content': 'Help to buy some drinks',
            'flow_no': 'FW201601010003',
            'date': 'Wed Jul 03 2017 19:08:54 GMT+0800 (CST)'
          }],
          titles: [{
            prop: 'flow_no',
            label: 'NO.'
          }, {
            prop: 'content',
            label: 'Content'
          }, {
            prop: 'flow_type',
            label: 'Type'
          }],
          filters: [
            {
              value: '',
              filterFn: (row, filter) => {
                return Object.keys(row).some(prop => {
                  if (prop === 'date') {
                    return this.getDate(row.date).indexOf(filter.value) > -1
                  } else {
                    return row[prop].toLowerCase().indexOf(filter.value.toLowerCase()) > -1
                  }
                })
              }
            }
          ]
        }
      },
      methods: {
        getDate(date) {
          let elDate = new Date(date)
          return elDate.getFullYear() +
          '-' +
          (elDate.getMonth() + 1) +
          '-' +
          elDate.getDate()
        }
      }
    }, true)
    await nextTick(vm)
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), '2017-7-8', 'input')
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(2).should.have.text('2017-7-8')
  })
})

describe('server checkFilter', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('data-tables-server filter', async () => {
    vm = createVue({
      template: `
        <data-tables-server
          :data="data"
          :total="total"
          :filters="filters"
          @query-change="loadData">
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='8'>
                <el-input v-model="filters[0].value"></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.label">
          </el-table-column>
        </data-tables-server>
        `,
      data() {
        return {
          data: [],
          titles,
          total: 0,
          filters: [
            {
              value: '',
              'search_prop': 'flow_no'
            }
          ]
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
    await sleep(1500)
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'FW201601010000', 'input')
    await sleep(1000)
    let { rows } = getTableItems(vm)
    rows.should.have.length(1)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.at(0).should.have.text('FW201601010000')
  })
})
