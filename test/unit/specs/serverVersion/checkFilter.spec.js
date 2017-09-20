import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'
import Vue from 'vue'

describe('server checkedFilters', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let template = `
    <data-tables-server
      :data="tableData"
      ref="dataTable"
      :total='total'
      :checkbox-filter-def="checkboxFilterDef"
      :load-data='loadData'
      @load-data-success='loadDataSuccess'
      @load-data-fail='loadDataFail'
      @query-change='queryChange'>
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables-server>
  `

  let def = [{
    'code': 'created',
    'name': 'Created'
  }, {
    'code': 'assigned',
    'name': 'Assigned'
  }, {
    'code': 'accepted',
    'name': 'Accepted'
  }, {
    'code': 'closed',
    'name': 'Closed'
  }, {
    'code': 'cancelled',
    'name': 'Cancelled'
  }]

  it('normal render and click', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          total: 0,
          checkboxFilterDef: {
            props: 'state_code',
            def
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
        },
        queryChange(info) {
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let filters = vm.$el.querySelector('.filters')
        filters.should.have.class('el-col-14')
        let checkboxGroup = filters.querySelector('.el-checkbox-group')
        let checkboxs = checkboxGroup.children
        checkboxs.length.should.equal(5)
        let checkboxsExpectedResult = []
        for (var i = 0; i < checkboxs.length; i++) {
          let checkbox = checkboxs[i]
          checkbox.querySelector('.el-checkbox__label').should.have.text(def[i].name)
          checkbox.querySelector('.el-checkbox__original').should.have.value(def[i].code)

          checkbox.click()
          await sleep(DELAY)
          let innerCheckboxFilters = vm.$refs.dataTable.checkBoxValues
          innerCheckboxFilters.length.should.equal(1 + i)
          checkboxsExpectedResult.push(def[i].code)
          JSON.stringify(innerCheckboxFilters).should.equal(JSON.stringify(checkboxsExpectedResult))
        }

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

  it('checkbox filter and search filter', function(done) {
    let bus = new Vue()
    this.timeout(5000)

    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          total: 0,
          checkboxFilterDef: {
            def
          }
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo, 100)
        },
        loadDataSuccess(data, info) {
          bus.$emit('success', data, info)
        },
        loadDataFail(error) {
          console.log(error)
        },
        queryChange(info) {
          bus.$emit('info', info)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        let input = search.querySelector('input')

        input.value = 'repair'

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal('repair')
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

        await sleep(500)

        let filters = vm.$el.querySelector('.filters')
        let checkboxGroup = filters.querySelector('.el-checkbox-group')
        let checkboxs = checkboxGroup.children
        bus.$once('success', (data, info) => {
          data.req.filters[0].vals[0].should.equal('repair')
          data.req.filters[1].vals.toString().should.equal('created')
        })
        checkboxs[0].click()
        await sleep(500)

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal('repair')
            data.req.filters[1].vals.toString().should.equal('created,assigned')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('checkBoxChange')
            info.filters[1].vals.toString().should.equal('created,assigned')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        checkboxs[1].click()
        await sleep(500)

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal('repair')
            data.req.filters[1].vals.toString().should.equal('assigned')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('checkBoxChange')
            info.filters[1].vals.toString().should.equal('assigned')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        checkboxs[0].click()
        await sleep(500)

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal('repair')
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
            info.type.should.equal('checkBoxChange')
            info.filters[1].vals.toString().should.equal('')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        checkboxs[1].click()
        await sleep(500)

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal('repair')
            data.req.filters[1].vals.toString().should.equal('cancelled')
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        bus.$once('info', info => {
          try {
            info.type.should.equal('checkBoxChange')
            info.filters[1].vals.toString().should.equal('cancelled')
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })

        checkboxs[4].click()
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
