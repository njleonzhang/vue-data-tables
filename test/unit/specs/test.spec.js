import {createVue} from '../util'

let soureData = [{
  'building': '5',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Water flood',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010001',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '111111',
  'room_id': '00501',
  'room_no': '501',
  'state': 'Created',
  'state_code': 'created'
}, {
  'building': '6',
  'building_group': 'Sourth',
  'cellphone': '13400000000',
  'content': 'Lock broken',
  'create_time': '2016-10-01 22:25',
  'flow_no': 'FW201601010002',
  'flow_type': 'Repair',
  'flow_type_code': 'repair',
  'id': '2222222',
  'room_id': '00701',
  'room_no': '701',
  'state': 'Assigned',
  'state_code': 'assigned'
}, {
  'building': '9',
  'building_group': 'North',
  'cellphone': '13400000000',
  'content': 'Help to buy some drinks',
  'create_time': '2016-10-02 22:25',
  'flow_no': 'FW201601010003',
  'flow_type': 'Help',
  'flow_type_code': 'help',
  'id': '2222222',
  'room_id': '00601',
  'room_no': '601',
  'state': 'Closed',
  'state_code': 'closed'
}]

describe('render table', _ => {
  it('shoule render correct content', done => {
    let vm = createVue({
      template: `
      <div class="app-wrapper">
        <data-tables :data="tableData" :actions-def="actionsDef">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="flow_no" label="No." sortable="custom"></el-table-column>
          <el-table-column prop="content" label="Content" sortable="custom"></el-table-column>
          <el-table-column prop="create_time" label="Time" sortable="custom"></el-table-column>
          <el-table-column prop="state" label="State" sortable="custom"></el-table-column>
          <el-table-column prop="flow_type" label="Type" sortable="custom"></el-table-column>
          <el-table-column prop="building_group" label="Building group" sortable="custom"></el-table-column>
          <el-table-column prop="building" label="building" sortable="custom"></el-table-column>
          <el-table-column prop="room_no" label="no" sortable="custom"></el-table-column>
          <el-table-column prop="cellphone" label="tel" sortable="custom"></el-table-column>
        </data-tables>
      </div>
      `,
      data() {
        return {
          tableData: soureData,
          actionsDef: {
            colProps: {
              span: 5
            },
            def: [{
              name: 'new',
              handler: () => {
                this.$message('new clicked')
              },
              icon: 'plus',
              buttonProps: {
                type: 'primary'
              }
            }, {
              name: 'import',
              handler: () => {
                this.$message('import clicked')
              },
              icon: 'upload'
            }]
          }
        }
      },
    }, true)

    expect(vm.$el.querySelector('.actions').children.length).to.equal(2)
    done()
  })
})
