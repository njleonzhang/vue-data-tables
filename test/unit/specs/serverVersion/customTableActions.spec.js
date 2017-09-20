import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent, waitForVMready} from '../../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'

describe('server custom action bar', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let bus = new Vue()

  let template = `
    <data-tables-server
      :data="tableData"
      ref="dataTable"
      :total="total"
      :load-data='loadData'
      @load-data-success='loadDataSuccess'
      @load-data-fail='loadDataFail'
      @query-info="queryInfo"
      :custom-filters="customFilters"
      :show-action-bar="false">

      <div slot="custom-tool-bar">
        <el-row class='custom-tools'>
          <el-col :span="14">
            <el-input v-model="customFilters[0].vals"/>
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
    </data-tables-server>
  `
  it('button and filters1', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          inputVal: '',
          customFilters: [{
            vals: '',
            type: 'input'
          }, {
            vals: [],
            type: 'selector'
          }],
          total: 0
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data, info) {
          bus.$emit('success', data, info)
        },
        loadDataFail(error) {
          console.log(error)
        },
        queryInfo(info) {
          bus.$emit('info', info)
        }
      }
    }, true)

    let test = async function () {
      try {
        await waitForVMready(vm)
        let actionBarRow = vm.$el.querySelector('.custom-tools')
        should.exist(actionBarRow)
        let elCols = actionBarRow.children
        elCols.length.should.equal(2)

        await sleep(200)

        let input = elCols[0].querySelector('input')
        input.value = 'Water flood'

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].type.should.equal('input')
            data.req.filters[0].vals.toString().should.equal('Water flood')
            data.req.filters[1].type.should.equal('selector')
            data.req.filters[1].vals.toString().should.equal('')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('searchBoxChange')
            info.filters[1].vals.toString().should.equal('')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        triggerEvent(input, 'input')

        await sleep(1000)

        let select = elCols[1].querySelector('.el-select')
        select.click()

        let selectItems = vm.$el.querySelectorAll('.el-select-dropdown__item')

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].type.should.equal('input')
            data.req.filters[0].vals.toString().should.equal('Water flood')
            data.req.filters[1].type.should.equal('selector')
            data.req.filters[1].vals.toString().should.equal('help')
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })
        selectItems[1].click()
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
