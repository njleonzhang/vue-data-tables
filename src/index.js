import DataTables from './components/DataTables'

export let install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

DataTables.install = install

export default DataTables
