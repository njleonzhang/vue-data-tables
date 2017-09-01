import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../tools/source'


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
      head.querySelectorAll('th')[9].innerText.should.not.contains('操作')
      should.not.exist(head.querySelector('td.ascending'))
      table.should.have.class('el-table--border')
      table.should.have.class('el-table--striped')
      destroyVM(vm)
      done()
    }, DELAY)
  })

  it('no data', done => {
    let vm = createVue({
      template: `
        <data-tables>
          <el-table-column v-for="title in titles"
            :prop="title.prop"
            :label="title.label"
            :key="title.prop" sortable="custom"/>
        </data-tables>
      `,
      data() {
        return {
          titles
        }
      },
    }, true)

    setTimeout(_ => {
      let rows = vm.$el.querySelector('tbody').querySelectorAll('tr')
      rows.length.should.equal(0)
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
