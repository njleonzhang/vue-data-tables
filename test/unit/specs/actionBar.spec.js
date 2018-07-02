import { data, titles } from '../tools/source'
import { destroyVM, createVue, getTableItems, nextTick, simulateEvent } from '../tools/utils'

describe('client actionBar render', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('should render correct actionBar', async () => {
    let spy1 = sinon.spy()
    vm = createVue({
      template: `
        <data-tables
          :data='data'
          :filters="filters"
          >
          <el-row slot="tool" style="margin: 10px 0">
            <el-col :span="5">
              <el-dropdown @command="handleClick">
                <el-button type="primary">Actions<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="new">new</el-dropdown-item>
                  <el-dropdown-item command="import">import</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <el-col :span="10">
              <el-select v-model="filters[1].value" multiple="multiple">
                <el-option label="Repair" value="repair"></el-option>
                <el-option label="Help" value="help"></el-option>
              </el-select>
            </el-col>
            <el-col :span="5" :offset="4">
              <el-input v-model="filters[0].value"></el-input>
            </el-col>
          </el-row>
          <el-table-column
            v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop'>
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles,
          filters: [{
            value: '',
            prop: 'flow_type',
          }, {
            value: []
          }]
        }
      },
      methods: {
        handleClick(command) {
          spy1()
          this.$message(`click dropdown button ${command}`)
        }
      }
    }, true)
    await nextTick(vm)
    let tool = vm.$el.find('.tool')
    let selectOptions = tool.findAll('.el-select-dropdown__item')

    selectOptions.at(0).click()
    await nextTick(vm)
    let { rows } = getTableItems(vm)
    rows.should.have.length(2)

    selectOptions.at(1).click()
    await nextTick(vm)
    let currentRows = getTableItems(vm).rows
    currentRows.should.have.length(3)

    let dropdownMenuItems = tool.findAll('.el-dropdown-menu__item')
    dropdownMenuItems.at(0).click()
    await nextTick(vm)
    spy1.should.have.been.calledOnce

    dropdownMenuItems.at(1).click()
    await nextTick(vm)
    spy1.should.have.have.callCount(2)

    let inputElm = tool.findAll('input')
    simulateEvent(inputElm.at(1), 'Help', 'input')
    await nextTick(vm)
    currentRows = getTableItems(vm).rows
    currentRows.should.have.length(1)
    let currentFirstRow = currentRows.at(0)
    let currentFirstRowTds = currentFirstRow.findAll('td')
    currentFirstRowTds.at(2).should.have.text('Help')
  })
})
