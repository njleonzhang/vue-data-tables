import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles} from '../../tools/source'

describe('client pagination def', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('pagination', done => {
    vm = createVue({
      template: `
        <data-tables :data="tableData" :pagination-def="paginationDef" ref="dataTable">
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
          paginationDef: {
            pageSize: 1,
            pageSizes: [1, 2, 3],
            currentPage: 2
          }
        }
      }
    }, true)

    setTimeout(_ => {
      let jump = vm.$el.querySelector('.el-pagination__jump').querySelector('.el-pagination__editor')
      jump.should.have.property('value', '2')
      vm.$refs.dataTable.innerPaginationDef.should.deep.equal({
        layout: 'prev, pager, next, jumper, sizes, total',
        pageSize: 1,
        pageSizes: [1, 2, 3],
        currentPage: 2
      })
      done()
    }, DELAY)
  })

  it('pagination is disabled', done => {
    vm = createVue({
      template: `
        <data-tables :data="tableData" :paginationDef="paginationDef" ref="dataTable">
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
          paginationDef: {
            show: false
          }
        }
      }
    }, true)

    setTimeout(_ => {
      let jump = vm.$el.querySelector('.pagination-wrap')
      should.not.exist(jump)

      done()
    }, DELAY)
  })

  it('pagination event', done => {
    let spy1 = sinon.spy()
    let spy2 = sinon.spy()

    vm = createVue({
      template: `
        <data-tables :data="tableData"
        :pagination-def="paginationDef"
        ref="dataTable"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
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
          paginationDef: {
            pageSize: 1,
            pageSizes: [1, 2, 3],
            currentPage: 2
          }
        }
      },
      methods: {
        handleSizeChange(size) {
          spy1(size)
        },
        handleCurrentChange(currentPage) {
          spy2(currentPage)
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let pagination = vm.$el.querySelector('.el-pagination')
        let jump = pagination.querySelector('.el-pagination__jump').querySelector('.el-pagination__editor')
        let select = pagination.querySelector('.el-select')
        select.click()
        await sleep(DELAY)

        let selectItems = pagination.querySelectorAll('.el-select-dropdown__item')
        selectItems[1].click()
        await sleep(DELAY)

        spy1.should.have.been.calledOnce
        spy1.should.have.been.calledWith(2)

        jump.focus()
        jump.value = 1
        triggerEvent(jump, 'change')

        await sleep(DELAY)
        spy2.should.have.been.calledOnce
        spy2.should.have.been.calledWith(1)
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
