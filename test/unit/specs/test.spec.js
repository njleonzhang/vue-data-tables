import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows} from '../util'
import chai from 'chai'

let DELAY = 10

let tableData = [{
  'building': '5',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Water flood',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010001',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '111111',
  'room_id': '00501',
  'room_no': '501',
  'state': 'Created',
  'state_code': 'created'
}, {
  'building': '6',
  'building_group': 'Sourth',
  'cellphone': '13400000000',
  'content': 'Lock broken',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010002',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '2222222',
  'room_id': '00701',
  'room_no': '701',
  'state': 'Assigned',
  'state_code': 'assigned'
}, {
  'building': '9',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Help to buy some drinks',
  'create_time': '2016-10-02 22:25',
  'flow_no': 'FW201601010003',
  'flow_type': 'Help',
  'flow_type_code': 'help',
  'id': '2222222',
  'room_id': '00601',
  'room_no': '601',
  'state': 'Closed',
  'state_code': 'closed'
}]

let titles = [{
  prop: 'flow_no',
  label: 'No.'
}, {
  prop: 'content',
  label: 'Content'
}, {
  prop: 'create_time',
  label: 'Time',
}, {
  prop: 'state',
  label: 'State'
}, {
  prop: 'flow_type',
  label: 'Type'
}, {
  prop: 'building_group',
  label: 'building'
}, {
  prop: 'building',
  label: 'building'
}, {
  prop: 'room_no',
  label: 'no'
}, {
  prop: 'cellphone',
  label: 'tel'
}]

describe('render table', _ => {
  it('shoule render correct content', done => {
    let vm = createVue({
      template: `
        <data-tables :data="tableData">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData,
          titles
        }
      },
    }, true)

    setTimeout(_ => {
      let {table, head, body, rows} = getTableItems(vm.$el);
      rows.length.should.equal(3)
      let secondItem = rows[1]
      let secondItemTds = secondItem.querySelectorAll('td')
      secondItemTds[0].innerText.should.contains('FW201601010002')
      secondItemTds[5].innerText.should.contains('Sourth')
      head.querySelectorAll('th')[9].innerText.should.contains('操作')
      should.not.exist(head.querySelector('td.ascending'))
      table.should.have.class('el-table--border')
      table.should.have.class('el-table--striped')
      destroyVM(vm)
      done()
    }, DELAY)
  })
})

describe('data table property', _ => {
  it('hide action', done => {
    let vm = createVue({
      template: `
        <data-tables :data="tableData" :action-col-def="actionColDef">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData,
          titles,
          actionColDef: {
            show: false
          }
        }
      },
    }, true)

    setTimeout(_ => {
      // include a width0 column seems from element
      let head = getHead(vm.$el)
      head.querySelectorAll('th').length.should.equal(10)
      vm.$el.querySelector('thead').querySelectorAll('th')[9].innerText.should.equal("")
      done()
    })
  })

  it('col can not click', done => {
    let rowClickCnt = 0

    let vm = createVue({
      template: `
        <data-tables :data="tableData"
          :col-not-row-click="canNotClickList"
          @row-click="itemClick()">
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData,
          titles,
          canNotClickList: ['flow_no', 'room_no']
        }
      },
      methods: {
        itemClick() {
          rowClickCnt++
        }
      }
    }, true)

    var test = async function() {
      try {
        // include a width0 column seems from element
        await sleep(DELAY)
        let secondItem = vm.$el.querySelectorAll('.el-table__row')[1]
        let secondItemTds = secondItem.querySelectorAll('td')

        await sleep(DELAY)
        secondItemTds[0].click()
        rowClickCnt.should.equal(0)

        await sleep(DELAY)
        secondItemTds[5].click()
        rowClickCnt.should.equal(1)

        await sleep(DELAY)
        secondItemTds[7].click()
        rowClickCnt.should.equal(1)

        await sleep(DELAY)
        for (var i = 0; i < 10; i++) {
          secondItemTds[2].click()
        }
        rowClickCnt.should.equal(11)

        await sleep(DELAY)
        secondItemTds[9].click()
        rowClickCnt.should.equal(11)

        done();
      } catch (err) {
        done(err);
      }
    } ()
  })

  it('tableProps', done => {
    let vm = createVue({
      template: `
        <data-tables :data="tableData" :tableProps='tableProps'>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          tableData,
          titles,
          tableProps: {
            border: false,
            stripe: false,
            defaultSort: {
              prop: 'flow_no',
              order: 'descending'
            }
          }
        }
      },
      methods: {
        itemClick() {
          rowClickCnt++
        }
      }
    }, true)

    setTimeout(_ => {
      let table = getTable(vm.$el);
      table.should.not.have.class('el-table--border')
      table.should.not.have.class('el-table--striped')
      let head = getHead(table)
      head.querySelectorAll('th')[0].should.have.class('descending')
      done()
    }, DELAY)
  })
})

describe('pagination def', _ => {
  it('pagination', done => {
    let vm = createVue({
      template: `
        <data-tables :data="tableData" :paginationDef="paginationDef" ref="dataTable">
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
          titles,
          paginationDef: {
            pageSize: 1,
            pageSizes: [1, 2, 3],
            currentPage: 2
          }
        }
      }
    }, true)

    setTimeout(_ => {
      let jump = vm.$el.querySelector('.el-pagination__jump').querySelector('.el-pagination__editor')
      jump.should.have.property('value', '2')
      vm.$refs.dataTable.innerPaginationDef.should.deep.equal({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      })
      done()
    }, DELAY)
  })
})

describe('table actions def', _ => {
  it('action render', done => {
    let newClickedCnt = 0;
    let importClickedCnt = 0;

    let vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          :actions-def="actionsDef"
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
          titles,
          actionsDef: {
            colProps: {
              span: 5
            },
            def: [{
              name: 'new',
              handler: () => {
                newClickedCnt++
              }
            }, {
              name: 'import',
              handler: () => {
                importClickedCnt++
              },
              icon: 'upload',
              buttonProps: {
                type: 'text'
              }
            }]
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let actionBar = vm.$el.querySelector('.actions')
        let buttons = actionBar.children
        actionBar.should.have.class('el-col-5')
        buttons.length.should.equal(2)
        should.not.exist(buttons[0].querySelector('i'))
        should.exist(buttons[1].querySelector('.el-icon-upload'))
        buttons[0].should.have.class('el-button--primary')
        buttons[1].should.have.class('el-button--text')

        for (var i = 0; i <10; i++) {
          buttons[0].click()
        }
        await sleep(DELAY)
        newClickedCnt.should.equal(10)
        importClickedCnt.should.equal(0)

        for (var i = 0; i < 20; i++) {
          buttons[1].click()
        }
        await sleep(DELAY)
        newClickedCnt.should.equal(10)
        importClickedCnt.should.equal(20)
        done()
      } catch (e) {
        done(e)
      }
    }

    test()
  })
})
