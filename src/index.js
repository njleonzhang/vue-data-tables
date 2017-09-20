import DataTables from './components/DataTables'
import DataTablesServer from './components/DataTablesServer'

let install = function(Vue) {
  Vue.component(DataTables.name, DataTables)
}

DataTables.install = install

DataTablesServer.install = function(Vue) {
  Vue.component(DataTablesServer.name, DataTablesServer)
}

export default DataTables

export {
  install,
  DataTables,
  DataTablesServer,
}
