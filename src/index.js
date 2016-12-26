import DataTables from './components/DataTables'

DataTables.install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

export default DataTables
