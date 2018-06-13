import { data, titles } from '../tools/source'
import { createVue, getTableItems, nextTick, sleep } from '../tools/utils'

describe.only('client actionColDef', _ => {
  let wrapper
  // Action column generator
  afterEach(function() {
    wrapper.destroy()
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
    })
    await nextTick(wrapper.vm)
    let { rows } = getTableItems(wrapper)
    let firstRow = rows.at(0)
    let firstRowTds = firstRow.findAll('td')
    firstRowTds.length.should.equal(4)
    let fouthItemTds = firstRowTds.at(3)
    let button = fouthItemTds.findAll('button')
    button.at(0).text().should.equal('Edit')
    button
      .at(0)
      .text()
      .should.equal('Edit')
    button.at(0).trigger('click')

    await sleep(300)

    // spy1.should.have.been.calledOnce

    let newRows = getTableItems(wrapper).rows
    firstRow = newRows.at(0)
    firstRowTds = firstRow.findAll('td').at(0)
    firstRowTds
      .text()
      .should.equal('hello world')

    button.at(1).trigger('click')
    // await sleep(300)
    // newRows = getTableItems(wrapper).rows
    // newRows.length.should.equal(2)
  })
})
