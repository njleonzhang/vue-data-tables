import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client checkedFilters', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  let template =  `
    <data-tables
      :data="tableData"
      ref="dataTable"
      :checkbox-filter-def="checkboxFilterDef">
      <el-table-column v-for="title in titles"
        :prop="title.prop"
        :label="title.label"
        :key="title.prop"
        sortable="custom"/>
    </data-tables>
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
    let newClickedCnt = 0;
    let importClickedCnt = 0;

    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          checkboxFilterDef: {
            props: 'state_code',
            def
          }
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
        console.log(e)
        done({
          message: e.message,
          stack: e.stack
        })
      }
    }

    test()
  })

  it('custom filter', done => {
    vm = createVue({
      template,
      data() {
        return {
          tableData,
          titles,
          checkboxFilterDef: {
            def,
            filterFunction(el, filter) {
              return el['state_code'].toString() === filter.vals[0]
            }
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let filters = vm.$el.querySelector('.filters')
        let checkboxGroup = filters.querySelector('.el-checkbox-group')
        let checkboxs = checkboxGroup.children

        await sleep(DELAY)
        checkboxs[4].click()
        checkboxs[0].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(1)

        checkboxs[4].click()
        checkboxs[1].click()
        checkboxs[2].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(1)

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


  it('checkbox filter and search filter', function(done) {
    this.timeout(5000)
    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :checkbox-filter-def="checkboxFilterDef">
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
          checkboxFilterDef: {
            def
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let search = vm.$el.querySelector('.search')
        let input = search.querySelector('input')

        input.value = 'repair'

        triggerEvent(input, 'input')

        let filters = vm.$el.querySelector('.filters')
        let checkboxGroup = filters.querySelector('.el-checkbox-group')
        let checkboxs = checkboxGroup.children

        checkboxs[0].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(1)

        checkboxs[1].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(2)

        checkboxs[0].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(1)

        checkboxs[1].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(2)

        checkboxs[4].click()
        await sleep(DELAY)
        getBody(vm.$el).querySelectorAll('tr').length.should.equal(0)

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

  it('null in table', done => {
    let titles = [{
      prop: 'name',
      label: '姓名'
    }, {
      prop: 'age',
      label: '姓名'
    }]

    let tableData = [{
      name: 'leon',
      age: 9
    }, {
      name: 'candy',
      age: null
    }]

    vm = createVue({
      template: `
        <data-tables
          :data="tableData"
          ref="dataTable"
          :checkbox-filter-def="checkboxFilterDef">
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
          checkboxFilterDef: {
            def: [{
              'code': 'leon',
              'name': 'leon'
            }, {
              'code': 'candy',
              'name': 'candy'
            }]
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)

        let filters = vm.$el.querySelector('.filters')
        let checkboxGroup = filters.querySelector('.el-checkbox-group')
        let checkboxs = checkboxGroup.children

        await sleep(DELAY)
        checkboxs[0].click()
        await sleep(DELAY)
        let rows = getBody(vm.$el).querySelectorAll('tr')
        rows.length.should.equal(1)
        rows[0].querySelectorAll('.cell')[0].should.have.text('leon')
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
})
