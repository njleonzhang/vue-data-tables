import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent, waitForVMready} from '../../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles, mockServer} from '../../tools/source'

describe('server searchDef', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let template =  `
    <data-tables-server
      :data="tableData"
      ref="dataTable"
      :search-def="searchDef">
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables-server>
  `

  it('show and hide search bar', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          searchDef: {
            show: false
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        should.not.exist(vm.$el.querySelector('.search'))
        vm.searchDef.show = true;

        await sleep(DELAY)
        should.exist(vm.$el.querySelector('.search'))
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

  it('search box colProps', done => {
    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'>
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
          searchDef: {
            colProps: {
              span: 10
            }
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)
        search.should.have.class('el-col-10')

        vm.searchDef.colProps.span = 5
        await sleep(DELAY)
        search.should.have.class('el-col-5')
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

  it('search box inputProps', done => {
    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'>
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
          searchDef: {
            inputProps: {
              placeholder: 'test placeHolder',
              readonly: true
            }
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        let input = search.querySelector('input')
        input.should.have.attr('placeholder', 'test placeHolder')
        input.should.have.attr('readonly', 'readonly')
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

  it('search 0', done => {

    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables-server :data="tableData"
        :load-data="loadData" 
        :total="total"
        @load-data-success='loadDataSuccess'
        @load-data-fail='loadDataFail'
        @query-change='queryChange'
        ref="dataTable">
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
          total: 0
        }
      },
      methods: {
        loadData(queryInfo) {
          return mockServer(queryInfo)
        },
        loadDataSuccess(data, info) {
          this.tableData = data.data
          this.total = data.total
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
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 0

        await sleep(300)

        bus.$once('success', (data, info) => {
          try {
            data.req.filters[0].vals[0].should.equal("0")
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
            info.filters[0].vals[0].should.equal("0")
            done()
          } catch (e) {
            done({
              message: e.message,
              stack: e.stack
            })
          }
        })
        triggerEvent(input, 'input')
      } catch (e) {
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()
  })

  it('search icon change', done => {
    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          ref="dataTable"
          :search-def="searchDef">
          <el-table-column 
            v-for="title in titles"
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
          searchDef: {
            inputProps: {
              icon: undefined
            }
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let searchIcon = search.querySelector('.el-input__icon.el-icon-search')
        should.exist(searchIcon)

        vm.searchDef.inputProps.icon = 'loading'
        await waitForVMready(vm)
        should.exist(search.querySelector('.el-input__icon.el-icon-loading'))
        should.not.exist(search.querySelector('.el-input__icon.el-icon-search'))

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
