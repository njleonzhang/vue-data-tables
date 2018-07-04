import { data, titles } from '../tools/source'
import { destroyVM, createVue, nextTick, simulateEvent } from '../tools/utils'

describe('client event', _ => {
  let vm
  afterEach(function() {
    vm && destroyVM(vm)
  })
  it('filtered-data event', async () => {
    vm = createVue({
      template: `
        <data-tables :data="data" :filters="filters" @filtered-data="handleFilteredData">
          <el-row slot='tool' style='margin: 10px 0'>
            <el-col :span='6'>
              <el-input style="width: 200px; margin-left: 20px;" v-model="filters[0].value"></el-input>
            </el-col>
          </el-row>
          <el-table-column v-for="title in titles" :prop="title.prop" :label="title.label" :key="title.label">
          </el-table-column>
        </data-tables>
      `,
      data() {
        return {
          data: data(),
          titles,
          filters: [{
            value: ''
          }],
          filteredData: [],
          columns: ['flow_no', 'content', 'flow_type'],
          columnNames: ['Flow NO.', 'Content', 'type']
        }
      },
      methods: {
        handleFilteredData(filteredData) {
          this.filteredData = filteredData
        }
      }
    }, true)
    await nextTick(vm)
    let tool = vm.$el.find('.tool')
    let inputElm = tool.findAll('input')

    simulateEvent(inputElm.at(0), 'FW201601010001', 'input')
    await nextTick(vm)
    vm.$data.filteredData.should.have.length(1)
    vm.$data.filteredData[0].content.should.equal('Water flood')
    vm.$data.filteredData[0].flow_no.should.equal('FW201601010001')
    vm.$data.filteredData[0].flow_type.should.equal('Repair')
  })
})
