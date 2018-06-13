import { data, titles } from '../tools/source'
import { createVue, destroyVM, getTableItems, sleep } from '../tools/utils'

describe('client actionColDef', _ => {
  let wrapper
  // Action column generator
  afterEach(function() {
    wrapper && destroyVM(wrapper)
  })
  it('actionCol render', async () => {
    let spy1 = sinon.spy()
    let spy2 = sinon.spy()

    wrapper = createVue({
      template: `
        <data-tables :data="data" :action-col="actionCol">
          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.prop">
          </el-table-column>
        </data-tables >
      `,
      data() {
        return {
          data: data(),
          titles,
          actionCol: {
            label: 'Actionsssssss',
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
    let { rows } = getTableItems(wrapper)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.should.have.length(4)
    let fouthItemTds = firstRowTds.at(3)
    let button = fouthItemTds.findAll('button')
    button.at(0).should.have.text('Edit')
    button.at(1).should.have.text('delete')

    button.at(0).click()
    spy1.should.have.been.calledOnce
    await sleep(300)
    let newRows = getTableItems(wrapper).rows
    firstRow = newRows.at(0)
    firstRowTds = firstRow.findAll('td').at(0)
    firstRowTds.should.have.text('hello world')

    button.at(1).click()
    spy2.should.have.been.calledOnce
    await sleep(300)
    newRows = getTableItems(wrapper).rows
    newRows.should.have.length(2)
  })
})
