import {createVue, destroyVM, sleep, getTableItems, getHead, getBody, getTable, getRows, triggerEvent} from '../../tools/util'
import {DELAY, tableData, titles} from '../../tools/source'

describe('server table actions def', _ => {
  let vm

  afterEach(function() {
    vm && destroyVM(vm)
  })

  it('action render', done => {
    let newClickedCnt = 0
    let importClickedCnt = 0

    vm = createVue({
      template: `
        <data-tables-server
          :data="tableData"
          :actions-def="actionsDef"
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
          actionsDef: {
            colProps: {
              span: 5
            },
            def: [{
              name: 'new',
              handler: () => {
                newClickedCnt++
              }
            }, {
              name: 'import',
              handler: () => {
                importClickedCnt++
              },
              icon: 'upload',
              buttonProps: {
                type: 'text'
              }
            }]
          }
        }
      }
    }, true)

    let test = async function() {
      try {
        await sleep(DELAY)
        let actionBar = vm.$el.querySelector('.actions')
        let buttons = actionBar.children
        actionBar.should.have.class('el-col-5')
        buttons.length.should.equal(2)
        should.not.exist(buttons[0].querySelector('i'))
        should.exist(buttons[1].querySelector('.el-icon-upload'))
        buttons[0].should.have.class('el-button--primary')
        buttons[1].should.have.class('el-button--text')

        for (var i = 0; i <10; i++) {
          buttons[0].click()
        }
        await sleep(DELAY)
        newClickedCnt.should.equal(10)
        importClickedCnt.should.equal(0)

        for (var i = 0; i < 20; i++) {
          buttons[1].click()
        }
        await sleep(DELAY)
        newClickedCnt.should.equal(10)
        importClickedCnt.should.equal(20)
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
