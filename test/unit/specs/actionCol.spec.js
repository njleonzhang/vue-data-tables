import { data, titles, http } from '../tools/source'
import { createVue, destroyVM, getTableItems, sleep } from '../tools/utils'

let actionColRender = async function(vm, spy1, spy2) {
  let { rows } = getTableItems(vm)
  let firstRow = rows.at(0)
  let firstRowTds = firstRow.findAll('td')
  firstRowTds.should.have.length(4)
  let forthItemTd = firstRowTds.at(3)
  let button = forthItemTd.findAll('button')
  button.at(0).should.have.text('Edit')
  button.at(1).should.have.text('delete')

  button.at(0).click()
  spy1.should.have.been.calledOnce
  await sleep(300)
  let newRows = getTableItems(vm).rows
  firstRow = newRows.at(0)
  firstRowTds = firstRow.findAll('td').at(0)
  firstRowTds.should.have.text('hello world')

  button.at(1).click()
  spy2.should.have.been.calledOnce
  await sleep(300)
  newRows = getTableItems(vm).rows
  newRows.should.have.length(rows.length - 1)
}

describe('client actionColDef', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('actionCol render', async () => {
    let spy1 = sinon.spy()
    let spy2 = sinon.spy()

    vm = createVue({
      template: `
        <data-tables
          :data="data"
          :action-col="actionCol">
          <el-table-column
            v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop">
          </el-table-column>
        </data-tables >
      `,
      data() {
        return {
          data: data(),
          titles,
          actionCol: {
            label: 'Actions',
            props: {
              align: 'center'
            },
            buttons: [
              {
                props: {
                  type: 'primary',
                  icon: 'el-icon-edit'
                },
                handler: row => {
                  spy1()
                  row.flow_no = 'hello world'
                  row.content = 'content changed'
                  row.flow_type = 'changed'
                },
                label: 'Edit'
              },
              {
                handler: row => {
                  spy2()
                  this.data.splice(this.data.indexOf(row), 1)
                },
                label: 'delete'
              }
            ]
          }
        }
      }
    }, true)
    await sleep(300)
    actionColRender(vm, spy1, spy2)
  })
})

describe('server actionColDef', _ => {
  let vm
  afterEach(function() {
    // vm && destroyVM(vm)
  })
  it('actionCol render', async () => {
    let spy1 = sinon.spy()
    let spy2 = sinon.spy()

    vm = createVue({
      template: `
        <data-tables-server
          ref='server'
          :data="data"
           :loading="loading"
          :total="total"
          @query-change="loadData"
          :action-col="actionCol"
        >
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
          loading: false,
          actionCol: {
            label: 'Actions',
            props: {
              align: 'center'
            },
            buttons: [
              {
                props: {
                  type: 'primary',
                  icon: 'el-icon-edit'
                },
                handler: row => {
                  spy1()
                  row.flow_no = 'hello world'
                  row.content = 'content changed'
                  row.flow_type = 'changed'
                },
                label: 'Edit'
              },
              {
                handler: row => {
                  spy2()
                  this.data.splice(this.data.indexOf(row), 1)
                },
                label: 'delete'
              }
            ]
          }
        }
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
    actionColRender(vm, spy1, spy2)
  })
  it('custom actionCol render', async () => {
    let spy1 = sinon.spy()
    let spy2 = sinon.spy()
    let spy3 = sinon.spy()

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
          <el-table-column label="Actions" min-width="100px">
            <template slot-scope="scope">
              <el-button v-for="button in customButtonsForRow(scope.row)" :key="button.name" type="text" @click="button.handler">{{ button.name }}</el-button>
              <el-checkbox :value="true">delete</el-checkbox>
            </template>
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
          this.loading = true
          let { data, total } = await http(queryInfo)
          this.data = data
          this.total = total
          this.loading = false
        },
        customButtonsForRow(row) {
          if (row.flow_type_code === 'repair') {
            return [{
              name: 'repairing',
              handler: _ => {
                spy1()
                row.flow_no = 'Number changed'
              }
            }, {
              name: 'repaired',
              handler: _ => {
                spy2()
                row.content = 'content changed'
              }
            }]
          } else {
            return [{
              name: 'help me',
              handler: _ => {
                spy3()
                row.content = 'content changed'
              }
            }]
          }
        },
        handleClick(command) {
          this.$message(`click dropdown button ${command}`)
        }
      }
    }, true)
    await sleep(1500)
    let { rows } = getTableItems(vm)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.should.have.length(4)
    let forthItemTd = firstRowTds.at(3)
    let firstButtons = forthItemTd.findAll('button')
    firstButtons.at(0).should.have.text('repairing')
    firstButtons.at(1).should.have.text('repaired')
    forthItemTd.find('input').should.have.attr('type', 'checkbox')
    forthItemTd.find('label').should.have.text('delete')

    let secondRow = rows.at(1)
    let secondRowTds = secondRow.findAll('td')
    secondRowTds.should.have.length(4)
    let secondRowForthItemTd = secondRowTds.at(3)
    let secondButton = secondRowForthItemTd.findAll('button')
    secondButton.should.have.length(1)
    secondButton.at(0).should.have.text('help me')

    firstButtons.at(0).click()
    firstButtons.at(1).click()
    spy1.should.have.been.calledOnce
    spy2.should.have.been.calledOnce
    await sleep(300)
    let newRows = getTableItems(vm).rows
    let newFirstRow = newRows.at(0)
    let newFirstRowTds = newFirstRow.findAll('td')
    newFirstRowTds.at(0).should.have.text('Number changed')
    newFirstRowTds.at(1).should.have.text('content changed')

    secondButton.at(0).click()
    await sleep(300)
    spy3.should.have.been.calledOnce
    newRows = getTableItems(vm).rows
    let newSecondRow = newRows.at(0)
    let newSecondRowTds = newSecondRow.findAll('td')
    newSecondRowTds.at(1).should.have.text('content changed')
  })
})
