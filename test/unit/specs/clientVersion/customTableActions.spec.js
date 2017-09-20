import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent, waitForVMready} from '../../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client custom action bar', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let bus = new Vue()

  let template =  `
    <data-tables
      :data="tableData"
      ref="dataTable"
      :custom-filters="customFilters"
      :show-action-bar="false"
      @filtered-data="filteredData">

      <div slot="custom-tool-bar">
        <el-row class='custom-tools'>
          <el-col :span="14">
            <el-input v-model="customFilters[0].vals" @change='change'/>
          </el-col>
          <el-col :span="5">
            <el-select v-model="customFilters[1].vals" multiple="multiple">
              <el-option label="维修" value="repair"></el-option>
              <el-option label="帮忙" value="help"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>

      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables>
  `
  it('button and filters1', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          inputVal: "",
          customFilters: [{
            vals: ''
          }, {
            vals: []
          }]
        }
      },
      methods: {
        change(val) {
        },

        filteredData() {
          bus.$emit('filtered-data')
        }
      }
    }, true)

    let test = async function() {
      try {
        await waitForVMready(vm)
        let actionBarRow = vm.$el.querySelector('.custom-tools')
        should.exist(actionBarRow)
        let elCols = actionBarRow.children
        elCols.length.should.equal(2)

        let body = getBody(vm.$el)
        let input = elCols[0].querySelector('input')
        input.value = 'Water flood'

        bus.$on('filtered-data', _ => {
          vm.$nextTick(_ => {
            let rows = getRows(body)
            rows.length.should.equal(1)
            let cells = rows[0].querySelectorAll('.cell')
            cells[0].should.have.text('FW201601010001')
            done()
          })
        })

        triggerEvent(input, 'input')
      } catch (e) {
        console.log(e)
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()
  })


  it('button and filters2', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          inputVal: "",
          customFilters: [{
            vals: ''
          }, {
            vals: []
          }]
        }
      },
      methods: {
        change(val) {
        },

        filteredData() {
          bus.$emit('filtered-data')
        }
      }
    }, true)

    let test = async function() {
      try {
        await waitForVMready(vm)
        let actionBarRow = vm.$el.querySelector('.custom-tools')
        should.exist(actionBarRow)
        let elCols = actionBarRow.children
        elCols.length.should.equal(2)

        let body = getBody(vm.$el)
        let input = elCols[0].querySelector('input')
        input.value = 'Water flood'

        input.value = ''
        triggerEvent(input, 'input')

        let select = vm.$el.querySelector('.el-select')
        select.click()

        let selectItems = vm.$el.querySelectorAll('.el-select-dropdown__item')
        selectItems[0].click()


        bus.$on('filtered-data', _ => {
          vm.$nextTick(_ => {
            let rows = getRows(body)
            rows.length.should.equal(2)
            let id1 = rows[0].querySelectorAll('.cell')[0]
            let id2 = rows[1].querySelectorAll('.cell')[0]
            id1.should.have.text('FW201601010001')
            id2.should.have.text('FW201601010002')
            done()
          })
        })

        triggerEvent(input, 'input')
      } catch (e) {
        console.log(e)
        done({
  message: e.message,
  stack: e.stack})
      }
    }

    test()
  })
})
