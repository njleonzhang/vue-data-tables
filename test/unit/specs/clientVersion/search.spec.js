import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent, waitForVMready} from '../../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client searchDef', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let template =  `
    <data-tables
      :data="tableData"
      ref="dataTable"
      :search-def="searchDef">
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables>
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
        vm.searchDef.show = true

        await sleep(DELAY)
        should.exist(vm.$el.querySelector('.search'))
        done()
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

  it('normal filter', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          @filtered-data="filtered">
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
          titles
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'Water flood'

        const spy = sinon.spy();

        bus.$on('filtered', filteredData => {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(1)
            let cells = rows[0].querySelectorAll('td')
            cells[0].should.have.text('FW201601010001')

            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 200);
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

  it('custom filter function match', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'
          @filtered-data="filtered">
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
          searchDef: {
            filterFunction(el, filter) {
              let props = Object.keys(el)
              return props.some(prop => {
                return el[prop].toString().indexOf(filter.vals[0]) > -1
              })
            }
          }
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'Water flood'

        const spy = sinon.spy();

        let filterCallBack = function(filterData) {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(1)
            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 500);
          })
        }

        bus.$on('filtered', filterCallBack)

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

  it('custom filter function not match', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'
          @filtered-data="filtered">
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
          searchDef: {
            filterFunction(el, filter) {
              let props = Object.keys(el)
              return props.some(prop => {
                return el[prop].toString().indexOf(filter.vals[0]) > -1
              })
            }
          }
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'water flood'

        const spy = sinon.spy();

        let filterCallBack = function(filterData) {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(0)

            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 200);
          })
        }

        bus.$on('filtered', filterCallBack)

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

  it('specific prop filter not match', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'
          @filtered-data="filtered">
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
          searchDef: {
            props: ['id', 'building', 'flow_type']
          }
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'water flood'

        const spy = sinon.spy();

        let filterCallBack = function(filterData) {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(0)
            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 200);
          })
        }

        bus.$on('filtered', filterCallBack)

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

  it('specific prop filter match', done => {
    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'
          @filtered-data="filtered">
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
          searchDef: {
            props: ['id', 'building', 'flow_type', 'content']
          }
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'water flood'

        const spy = sinon.spy();

        let filterCallBack = function(filterData) {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(1)

            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 200);
          })
        }

        bus.$on('filtered', filterCallBack)

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

  it('search box colProps', done => {
    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'>
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
        <data-tables
          :data="tableData"
          ref="dataTable"
          :searchDef='searchDef'>
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

    let titles = [{
      prop: 'name',
      label: '姓名'
    }, {
      prop: 'age',
      label: '姓名'
    }]

    let tableData = [{
      name: 'leon',
      age: 0
    }, {
      name: 'candy',
      age: 1
    }]

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          @filtered-data='filtered'>
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
          titles
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
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

        const spy = sinon.spy()

        let filterCallBack = function() {
          spy()
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(1)

            setTimeout(_ => {
              spy.should.have.been.called.once
              done()
            }, 200)
          })
        }

        bus.$on('filtered', filterCallBack)

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

  it('search table with null', done => {
    let titles = [{
      prop: 'name',
      label: '姓名'
    }, {
      prop: 'age',
      label: '姓名'
    }]

    let tableData = [{
      name: 'leon',
      age: null
    }, {
      name: 'candy',
      age: 1
    }]

    let bus = new Vue()

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          @filtered-data='filtered'>
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
          titles
        }
      },
      methods: {
        filtered(filteredData) {
          bus.$emit('filtered', filteredData)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        should.exist(search)

        let input = search.querySelector('input')
        input.value = 'candy'

        let filterCallBack = function() {
          vm.$nextTick(_ => {
            let body = getBody(vm.$el)
            let rows = getRows(body)
            rows.length.should.equal(1)
            rows[0].querySelectorAll('.cell')[0].should.have.text('candy')
            done()
          })
        }

        bus.$on('filtered', filterCallBack)

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
        <data-tables
          :data="tableData"
          ref="dataTable"
          :search-def="searchDef">
          <el-table-column 
            v-for="title in titles"
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
