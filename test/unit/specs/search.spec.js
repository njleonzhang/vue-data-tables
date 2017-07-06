import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../tools/source'

describe('searchDef', _ => {
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
    let vm = createVue({
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
        console.log(e)
        done(e)
      }
    }

    test()
  })

  it('normal filter', done => {
    let bus = new Vue()

    let vm = createVue({
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
        done(e)
      }
    }

    test()
  })

  it('custom filter function match', function(done) {
    this.timeout(5000)
    let bus = new Vue()

    let vm = createVue({
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
        done(e)
      }
    }

    test()
  })

  it('custom filter function not match', function(done) {
    this.timeout(5000)
    let bus = new Vue()

    let vm = createVue({
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
        done(e)
      }
    }

    test()
  })

  it('specific prop filter not match', function(done) {
    this.timeout(5000)
    let bus = new Vue()

    let vm = createVue({
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
        done(e)
      }
    }

    test()
  })

  it('specific prop filter match', function(done) {
    this.timeout(5000)
    let bus = new Vue()

    let vm = createVue({
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
        console.log(e)
        done(e)
      }
    }

    test()
  })

  it('search box colProps', done => {
    let vm = createVue({
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
        console.log(e)
        done(e)
      }
    }

    test()
  })

  it('search box inputProps', done => {
    let vm = createVue({
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
        console.log(e)
        done(e)
      }
    }

    test()
  })
})
