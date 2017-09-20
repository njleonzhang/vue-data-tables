import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'

describe('server actionColDef', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('property', done => {
    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          ref="dataTable"
          :actionColDef="actionColDef">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          tableData,
          titles,
          actionColDef: {
            label: 'action',
            fixed: 'right',
            def: [{
              name: 'test'
            }]
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let head = getHead(vm.$el)
        let cells = head.querySelectorAll('th')
        cells[9].querySelector('.cell').should.have.text('action')
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

  it('action defines', done => {

    let spy1 = sinon.spy()
    let spy2 = sinon.spy()

    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          ref="dataTable"
          :total='total'
          :load-data='loadData'
          @load-data-success='loadDataSuccess'
          @load-data-fail='loadDataFail'
          :actionColDef="actionColDef">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop"
            sortable="custom"/>
        </data-tables-server>
      `,
      data() {
        return {
          titles,
          tableData,
          total: 0,
          actionColDef: {
            def: [{
              handler: row => {
                spy1()
                this.$message('Edit clicked')
              },
              name: 'Edit'
            }, {
              icon: 'message',
              type: 'primary',
              handler: row => {
                spy2()
                this.$message('RUA in row clicked')
              },
              name: 'RUA'
            }]
          }
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data) {
          this.tableData = data.data
          this.total = data.total
        },
        loadDataFail(error) {
          console.log(error)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let head = getHead(vm.$el)
        let cells = head.querySelectorAll('th')
        cells[9].querySelector('.cell').should.have.text('操作')

        let body = getBody(vm.$el)
        let rows = getRows(body)
        let actionList = rows[1].querySelectorAll('td')[9].querySelector('.cell').querySelector('.action-list')
        should.exist(actionList)
        let buttons = actionList.querySelectorAll('button')
        buttons.length.should.equals(2)
        buttons[0].querySelector('span').should.have.text('Edit')
        buttons[0].should.have.class('el-button--text')
        buttons[1].querySelector('span').should.have.text('RUA')
        buttons[1].should.have.class('el-button--primary')
        should.exist(buttons[1].querySelector('i.el-icon-message'))

        for (var i = 0; i < 1; i++) {
          buttons[0].click()
        }

        for (var i = 0; i < 20; i++) {
          buttons[1].click()
        }

        await sleep(DELAY)
        spy1.should.have.been.calledOnce
        spy2.should.have.have.callCount(20)
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
