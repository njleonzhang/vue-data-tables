import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../tools/util'
import Vue from 'vue'
import {DELAY, tableData, titles} from '../tools/source'

describe('pagination def', _ => {
  it('pagination', done => {
    let vm = createVue({
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
    let vm = createVue({
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
})
