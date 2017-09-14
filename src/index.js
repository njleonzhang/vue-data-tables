import DataTables from './components/DataTables'
import DataTablesServer from './components/DataTablesServer'

export let install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

DataTables.install = install

export default DataTables

DataTablesServer.install = function(Vue) {
  Vue.component(DataTablesServer.name, DataTablesServer)
}

export {
  DataTablesServer,
  DataTables
}
