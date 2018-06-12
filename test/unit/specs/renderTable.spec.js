import { data, titles } from '../tools/source'
import { nextTick, createVue } from '../tools/utils'

describe('client render table', _ => {
  let wrapper

  afterEach(function() {
  })

  it('should render correct content', async () => {
    wrapper = createVue({
      template: `
        <data-tables :data='data'>
          <el-table-column v-for='title in titles'
            :prop='title.prop'
            :label='title.label'
            :key='title.prop' sortable='custom'/>
        </data-tables>
      `,
      data() {
        return {
          data,
          titles
        }
      },
    })

    await nextTick(wrapper.vm)

    console.log(wrapper.html())
  })
})
