import Vue from 'vue'
import { data, titles } from '../tools/source'

let id = 0

const createElm = function() {
  const elm = document.createElement('div')

  elm.id = 'app' + ++id
  document.body.appendChild(elm)

  return elm
}

/**
 * 创建一个 Vue 的实例对象
 * @param  {Object|String}  Compo   组件配置，可直接传 template
 * @param  {Boolean=false} mounted 是否添加到 DOM 上
 * @return {Object} vm
 */
let createVue = function(Compo, mounted = false) {
  if (Object.prototype.toString.call(Compo) === '[object String]') {
    Compo = { template: Compo }
  }
  return new Vue(Compo).$mount(mounted === false ? null : createElm())
}

describe('client render table', _ => {
  let vm

  afterEach(function() {
    // vm && destroyVM(vm)
  })

  it('should render correct content', () => {
    vm = createVue({
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
    }, true)
  })
})
