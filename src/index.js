import DataTables from './components/DataTables'

export let install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

export default DataTables
