import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent, waitForVMready} from '../../tools/util'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client events', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('row-click col can not click', done => {
    let rowClickCnt = 0

    vm = createVue({
      template: `
        <data-tables :data="tableData"
          :col-not-row-click="canNotClickList"
          :action-col-def="actionColDef"
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
          canNotClickList: ['flow_no', 'room_no'],
          actionColDef: {
            def: [{
              name: 'test'
            }]
          }
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

        done()
      } catch (err) {
        done({
          message: err.message,
          stack: err.stack
        })
      }
    } ()
  })

  it('cell-click col can not click', done => {
    let rowClickCnt = 0

    vm = createVue({
      template: `
        <data-tables :data="tableData"
          :col-not-row-click="canNotClickList"
          :action-col-def="actionColDef"
          @cell-click="itemClick">
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
          canNotClickList: ['flow_no', 'room_no'],
          actionColDef: {
            def: [{
              name: 'test'
            }]
          }
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

        done()
      } catch (err) {
        done({
          message: err.message,
          stack: err.stack
        })
      }
    } ()
  })

  it('sort-change event', done => {
    let sortObject

    vm = createVue({
      template: `
        <data-tables :data="tableData"
          :col-not-row-click="canNotClickList"
          :action-col-def="actionColDef"
          @sort-change="sortChange">
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
          canNotClickList: ['flow_no', 'room_no'],
          actionColDef: {
            def: [{
              name: 'test'
            }]
          }
        }
      },
      methods: {
        sortChange(object) {
          sortObject = object
        }
      }
    }, true)

    var test = async function() {
      try {
        // include a width0 column seems from element
        await sleep(DELAY)
        let ths = vm.$el.querySelectorAll('th')

        await sleep(DELAY)
        ths[2].click()

        sortObject.prop.should.equal('create_time')

        done()
      } catch (err) {
        done({
          message: err.message,
          stack: err.stack
        })
      }
    } ()
  })
})
