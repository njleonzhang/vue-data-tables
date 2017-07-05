import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../tools/source'

describe('checkedFilters', _ => {
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

    let vm = createVue({
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
          let innerCheckboxFilters = vm.$refs.dataTable.checkedFilters
          innerCheckboxFilters.length.should.equal(1 + i)
          checkboxsExpectedResult.push(def[i].code)
          JSON.stringify(innerCheckboxFilters).should.equal(JSON.stringify(checkboxsExpectedResult))
        }

        done()
      } catch (e) {
        console.log(e)
        done(e)
      }
    }

    test()
  })

  it('checkbox filter and search filter', done => {
    let vm = createVue({
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
        done(e)
      }
    }

    test()
  })
})
