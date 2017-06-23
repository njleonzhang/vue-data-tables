import {createVue, destroyVM, sleep} from '../util'

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
      expect(vm.$el.querySelectorAll('.el-table__row').length).to.equal(3)
      let secondItem = vm.$el.querySelectorAll('.el-table__row')[1]
      let secondItemTds = secondItem.querySelectorAll('td')
      expect(secondItemTds[0].innerText).contains('FW201601010002')
      expect(secondItemTds[5].innerText).contains('Sourth')
      expect(vm.$el.querySelector('thead').querySelectorAll('th')[9].innerText).contains('操作')
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
      expect(vm.$el.querySelector('thead').querySelectorAll('th').length).equal(10)
      expect(vm.$el.querySelector('thead').querySelectorAll('th')[9].innerText).equal("")
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
        expect(rowClickCnt).equal(0)

        await sleep(DELAY)
        secondItemTds[5].click()
        expect(rowClickCnt).equal(1)

        await sleep(DELAY)
        secondItemTds[7].click()
        expect(rowClickCnt).equal(1)

        await sleep(DELAY)
        for (var i = 0; i < 10; i++) {
          secondItemTds[2].click()
        }
        expect(rowClickCnt).equal(11)

        await sleep(DELAY)
        secondItemTds[9].click()
        expect(rowClickCnt).equal(11)

        done();
      } catch (err) {
        done(err);
      }
    } ()

  })
})
